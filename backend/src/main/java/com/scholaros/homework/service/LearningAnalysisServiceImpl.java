package com.scholaros.homework.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholaros.homework.ai.AIAnalysisResult;
import com.scholaros.homework.ai.AIProvider;
import com.scholaros.homework.ai.AIResponseParser;
import com.scholaros.homework.ai.PromptBuilder;
import com.scholaros.homework.dto.GenerateAnalysisRequest;
import com.scholaros.homework.dto.LearningAnalysisResponse;
import com.scholaros.homework.entity.Assessment;
import com.scholaros.homework.entity.AssessmentAttempt;
import com.scholaros.homework.entity.AttemptStatus;
import com.scholaros.homework.entity.HomeworkRecommendation;
import com.scholaros.homework.entity.LearningAnalysis;
import com.scholaros.homework.entity.Question;
import com.scholaros.homework.entity.StudentAnswer;
import com.scholaros.homework.exception.BadRequestException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.LearningAnalysisMapper;
import com.scholaros.homework.repository.AssessmentAttemptRepository;
import com.scholaros.homework.repository.LearningAnalysisRepository;
import com.scholaros.homework.repository.QuestionRepository;
import com.scholaros.homework.repository.StudentAnswerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LearningAnalysisServiceImpl implements LearningAnalysisService {

    private final LearningAnalysisRepository analysisRepository;
    private final AssessmentAttemptRepository attemptRepository;
    private final QuestionRepository questionRepository;
    private final StudentAnswerRepository answerRepository;
    private final PromptBuilder promptBuilder;
    private final AIProvider aiProvider;
    private final AIResponseParser responseParser;
    private final LearningAnalysisMapper analysisMapper;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public LearningAnalysisResponse generateAnalysis(final GenerateAnalysisRequest request) {
        final UUID attemptId = request.getAssessmentAttemptId();
        log.info("Generating AI learning analysis for assessment attempt ID: {}", attemptId);

        final Optional<LearningAnalysis> existingOpt = analysisRepository.findByAssessmentAttemptId(attemptId);
        if (existingOpt.isPresent()) {
            log.info("Learning analysis already exists for attempt ID: {}. Returning existing analysis", attemptId);
            return analysisMapper.toResponse(existingOpt.get());
        }

        final AssessmentAttempt attempt = attemptRepository.findByIdAndActiveTrue(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentAttempt", "id", attemptId));

        if (attempt.getStatus() == AttemptStatus.IN_PROGRESS || attempt.getStatus() == AttemptStatus.NOT_STARTED) {
            throw new BadRequestException("Only completed or evaluated attempts can be analyzed");
        }

        final Assessment assessment = attempt.getAssessment();
        final List<Question> questions = questionRepository.findByAssessmentIdAndActiveTrueOrderByDisplayOrderAsc(assessment.getId());
        final List<StudentAnswer> studentAnswers = answerRepository.findByAttemptId(attemptId);

        // Build prompt
        final String prompt = promptBuilder.buildAnalysisPrompt(attempt, assessment, questions, studentAnswers);
        log.debug("Built AI analysis prompt");

        // Invoke AI Provider
        final String rawResponse = aiProvider.generateContent(prompt);
        log.debug("Received response from AI provider: {}", aiProvider.getModelName());

        // Parse response
        final AIAnalysisResult parsedResult = responseParser.parseResponse(rawResponse);

        final String strongConceptsStr = toJsonString(parsedResult.getStrongConcepts());
        final String weakConceptsStr = toJsonString(parsedResult.getWeakConcepts());
        final String misconceptionsStr = toJsonString(parsedResult.getMisconceptions());

        final LearningAnalysis analysis = LearningAnalysis.builder()
                .assessmentAttempt(attempt)
                .overallMasteryPercentage(parsedResult.getOverallMasteryPercentage() != null ? parsedResult.getOverallMasteryPercentage() : attempt.getPercentage())
                .masteryLevel(parsedResult.getMasteryLevel())
                .strongConcepts(strongConceptsStr)
                .weakConcepts(weakConceptsStr)
                .misconceptions(misconceptionsStr)
                .confidenceScore(parsedResult.getConfidenceScore() != null ? parsedResult.getConfidenceScore() : 0.8)
                .recommendedDifficulty(parsedResult.getRecommendedDifficulty())
                .recommendedStudyMinutes(parsedResult.getRecommendedStudyMinutes() != null ? parsedResult.getRecommendedStudyMinutes() : 15)
                .analysisSummary(parsedResult.getAnalysisSummary())
                .aiModel(aiProvider.getModelName())
                .analysisTimestamp(LocalDateTime.now())
                .active(true)
                .build();

        final String recTopicsStr = toJsonString(parsedResult.getRecommendedTopics());
        final String recTypesStr = toJsonString(parsedResult.getRecommendedQuestionTypes());

        final HomeworkRecommendation recommendation = HomeworkRecommendation.builder()
                .learningAnalysis(analysis)
                .recommendedDifficulty(parsedResult.getRecommendedDifficulty())
                .recommendedQuestionCount(parsedResult.getRecommendedQuestionCount() != null ? parsedResult.getRecommendedQuestionCount() : 5)
                .recommendedPracticeMinutes(parsedResult.getRecommendedPracticeMinutes() != null ? parsedResult.getRecommendedPracticeMinutes() : 15)
                .recommendedTopics(recTopicsStr)
                .recommendedQuestionTypes(recTypesStr)
                .priorityLevel(parsedResult.getPriorityLevel())
                .recommendationReason(parsedResult.getRecommendationReason())
                .build();

        analysis.setRecommendation(recommendation);

        final LearningAnalysis saved = analysisRepository.save(analysis);
        log.info("Learning analysis and recommendation created successfully with ID: {}", saved.getId());
        return analysisMapper.toResponse(saved);
    }

    @Override
    public LearningAnalysisResponse getAnalysisByAttemptId(final UUID attemptId) {
        log.debug("Fetching learning analysis for attempt ID: {}", attemptId);
        final LearningAnalysis analysis = analysisRepository.findByAssessmentAttemptId(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("LearningAnalysis", "assessmentAttemptId", attemptId));
        return analysisMapper.toResponse(analysis);
    }

    private String toJsonString(final List<String> list) {
        if (list == null || list.isEmpty()) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(list);
        } catch (final Exception e) {
            log.warn("Failed to serialize list to JSON: {}", e.getMessage());
            return list.toString();
        }
    }
}

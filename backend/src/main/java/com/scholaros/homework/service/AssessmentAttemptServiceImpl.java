package com.scholaros.homework.service;

import com.scholaros.homework.dto.AssessmentAttemptResponse;
import com.scholaros.homework.dto.AssessmentResultResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.SaveAnswerRequest;
import com.scholaros.homework.dto.StartAssessmentRequest;
import com.scholaros.homework.dto.StudentAnswerResponse;
import com.scholaros.homework.dto.SubmitAssessmentRequest;
import com.scholaros.homework.entity.Assessment;
import com.scholaros.homework.entity.AssessmentAttempt;
import com.scholaros.homework.entity.AssessmentConfiguration;
import com.scholaros.homework.entity.AssessmentStatus;
import com.scholaros.homework.entity.AttemptStatus;
import com.scholaros.homework.entity.Question;
import com.scholaros.homework.entity.QuestionOption;
import com.scholaros.homework.entity.QuestionType;
import com.scholaros.homework.entity.StudentAnswer;
import com.scholaros.homework.exception.BadRequestException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.AssessmentAttemptMapper;
import com.scholaros.homework.mapper.StudentAnswerMapper;
import com.scholaros.homework.repository.AssessmentAttemptRepository;
import com.scholaros.homework.repository.AssessmentAttemptSpecification;
import com.scholaros.homework.repository.AssessmentRepository;
import com.scholaros.homework.repository.QuestionOptionRepository;
import com.scholaros.homework.repository.QuestionRepository;
import com.scholaros.homework.repository.StudentAnswerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssessmentAttemptServiceImpl implements AssessmentAttemptService {

    private final AssessmentAttemptRepository attemptRepository;
    private final StudentAnswerRepository answerRepository;
    private final AssessmentRepository assessmentRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository optionRepository;
    private final AssessmentAttemptMapper attemptMapper;
    private final StudentAnswerMapper answerMapper;

    @Override
    @Transactional
    public AssessmentAttemptResponse startAssessment(final StartAssessmentRequest request) {
        log.info("Starting assessment attempt for studentId: {}, assessmentId: {}", request.getStudentId(), request.getAssessmentId());

        final Assessment assessment = assessmentRepository.findByIdAndActiveTrue(request.getAssessmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", request.getAssessmentId()));

        if (assessment.getStatus() != AssessmentStatus.PUBLISHED) {
            throw new BadRequestException("Cannot attempt an assessment that is not PUBLISHED");
        }

        final LocalDateTime now = LocalDateTime.now();
        if (assessment.getAvailableFrom() != null && now.isBefore(assessment.getAvailableFrom())) {
            throw new BadRequestException("Assessment is not yet available");
        }
        if (assessment.getAvailableUntil() != null && now.isAfter(assessment.getAvailableUntil())) {
            throw new BadRequestException("Assessment availability period has ended");
        }

        final long existingAttempts = attemptRepository.countByAssessmentIdAndStudentIdAndActiveTrue(assessment.getId(), request.getStudentId());
        final AssessmentConfiguration config = assessment.getConfiguration();
        final int maxAttempts = config != null && config.getMaxAttempts() != null ? config.getMaxAttempts() : 1;

        if (!Boolean.TRUE.equals(assessment.getAllowMultipleAttempts()) && existingAttempts >= 1) {
            throw new BadRequestException("Multiple attempts are not allowed for this assessment");
        }
        if (existingAttempts >= maxAttempts) {
            throw new BadRequestException("Maximum attempt limit (" + maxAttempts + ") reached for this assessment");
        }

        final AssessmentAttempt attempt = AssessmentAttempt.builder()
                .assessment(assessment)
                .studentId(request.getStudentId())
                .schoolId(request.getSchoolId())
                .sectionId(request.getSectionId())
                .startedAt(now)
                .attemptNumber((int) existingAttempts + 1)
                .status(AttemptStatus.IN_PROGRESS)
                .score(0.0)
                .maximumScore(0.0)
                .percentage(0.0)
                .autoSubmitted(false)
                .evaluationCompleted(false)
                .active(true)
                .build();

        final AssessmentAttempt saved = attemptRepository.save(attempt);
        log.info("Assessment attempt started successfully with ID: {}", saved.getId());
        return attemptMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public StudentAnswerResponse saveAnswer(final UUID attemptId, final SaveAnswerRequest request) {
        log.info("Saving answer for attempt ID: {}, question ID: {}", attemptId, request.getQuestionId());

        final AssessmentAttempt attempt = attemptRepository.findByIdAndActiveTrue(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentAttempt", "id", attemptId));

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new BadRequestException("Cannot modify answers for an attempt that is " + attempt.getStatus());
        }

        final Question question = questionRepository.findByIdAndActiveTrue(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", request.getQuestionId()));

        if (!question.getAssessment().getId().equals(attempt.getAssessment().getId())) {
            throw new BadRequestException("Question ID " + request.getQuestionId() + " does not belong to Assessment ID " + attempt.getAssessment().getId());
        }

        final Optional<StudentAnswer> existingAnswerOpt = answerRepository.findByAttemptIdAndQuestionId(attemptId, request.getQuestionId());

        final StudentAnswer answer;
        if (existingAnswerOpt.isPresent()) {
            answer = existingAnswerOpt.get();
            answerMapper.updateEntityFromRequest(request, answer);
        } else {
            answer = answerMapper.toEntity(request);
            answer.setAttempt(attempt);
            answer.setQuestion(question);
        }

        final StudentAnswer saved = answerRepository.save(answer);
        log.info("Student answer saved successfully with ID: {}", saved.getId());
        return answerMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public StudentAnswerResponse updateAnswer(final UUID attemptId, final UUID questionId, final SaveAnswerRequest request) {
        request.setQuestionId(questionId);
        return saveAnswer(attemptId, request);
    }

    @Override
    @Transactional
    public AssessmentAttemptResponse submitAssessment(final UUID attemptId, final SubmitAssessmentRequest request) {
        log.info("Submitting assessment attempt ID: {}", attemptId);

        final AssessmentAttempt attempt = attemptRepository.findByIdAndActiveTrue(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentAttempt", "id", attemptId));

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new BadRequestException("Attempt is already submitted or completed");
        }

        final LocalDateTime now = LocalDateTime.now();
        attempt.setSubmittedAt(now);
        if (attempt.getStartedAt() != null) {
            attempt.setTimeTakenSeconds((int) Duration.between(attempt.getStartedAt(), now).getSeconds());
        }

        final boolean isAutoSubmitted = request != null && Boolean.TRUE.equals(request.getAutoSubmitted());
        attempt.setAutoSubmitted(isAutoSubmitted);
        attempt.setStatus(isAutoSubmitted ? AttemptStatus.AUTO_SUBMITTED : AttemptStatus.SUBMITTED);
        if (request != null && request.getRemarks() != null) {
            attempt.setRemarks(request.getRemarks());
        }

        // Perform Automatic Evaluation for objective questions
        autoEvaluateAttempt(attempt);

        final AssessmentAttempt saved = attemptRepository.save(attempt);
        log.info("Assessment attempt submitted successfully with ID: {}, status: {}", saved.getId(), saved.getStatus());
        return attemptMapper.toResponse(saved);
    }

    @Override
    public AssessmentAttemptResponse getAttemptById(final UUID attemptId) {
        log.debug("Fetching attempt by ID: {}", attemptId);
        final AssessmentAttempt attempt = attemptRepository.findByIdAndActiveTrue(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentAttempt", "id", attemptId));
        return attemptMapper.toResponse(attempt);
    }

    @Override
    public PageResponse<AssessmentAttemptResponse> getAttemptsByStudent(final UUID studentId, final Pageable pageable) {
        log.debug("Fetching attempts for student ID: {}", studentId);
        final Page<AssessmentAttemptResponse> page = attemptRepository.findByStudentIdAndActiveTrue(studentId, pageable)
                .map(attemptMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    public PageResponse<AssessmentAttemptResponse> searchAttempts(
            final UUID studentId,
            final UUID assessmentId,
            final AttemptStatus status,
            final LocalDateTime startDate,
            final LocalDateTime endDate,
            final Pageable pageable
    ) {
        log.debug("Searching assessment attempts");
        final Specification<AssessmentAttempt> spec = AssessmentAttemptSpecification.buildSpecification(studentId, assessmentId, status, startDate, endDate);
        final Page<AssessmentAttemptResponse> page = attemptRepository.findAll(spec, pageable)
                .map(attemptMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    public AssessmentResultResponse getAttemptResult(final UUID attemptId) {
        log.debug("Fetching result for attempt ID: {}", attemptId);
        final AssessmentAttempt attempt = attemptRepository.findByIdAndActiveTrue(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentAttempt", "id", attemptId));

        final List<Question> activeQuestions = questionRepository.findByAssessmentIdAndActiveTrueOrderByDisplayOrderAsc(attempt.getAssessment().getId());
        final List<StudentAnswer> studentAnswers = answerRepository.findByAttemptId(attemptId);

        final int totalQuestions = activeQuestions.size();
        final int totalAttempted = studentAnswers.size();
        final int totalCorrect = (int) studentAnswers.stream().filter(a -> Boolean.TRUE.equals(a.getCorrect())).count();

        final AssessmentResultResponse response = attemptMapper.toResultResponse(attempt);
        response.setTotalQuestions(totalQuestions);
        response.setTotalAttempted(totalAttempted);
        response.setTotalCorrect(totalCorrect);
        response.setObtainedMarks(attempt.getScore() != null ? attempt.getScore() : 0.0);
        response.setTotalMarks(attempt.getMaximumScore() != null ? attempt.getMaximumScore() : 0.0);
        response.setCorrectAnswersCount(totalCorrect);
        response.setIncorrectAnswersCount(Math.max(0, totalAttempted - totalCorrect));
        response.setAnswers(studentAnswers.stream().map(answerMapper::toResponse).collect(Collectors.toList()));

        return response;
    }

    private void autoEvaluateAttempt(final AssessmentAttempt attempt) {
        final Assessment assessment = attempt.getAssessment();
        final List<Question> activeQuestions = questionRepository.findByAssessmentIdAndActiveTrueOrderByDisplayOrderAsc(assessment.getId());
        final List<StudentAnswer> studentAnswers = answerRepository.findByAttemptId(attempt.getId());
        final Map<UUID, StudentAnswer> answerMap = studentAnswers.stream()
                .collect(Collectors.toMap(a -> a.getQuestion().getId(), Function.identity(), (a1, a2) -> a1));

        double totalScore = 0.0;
        double maxScore = 0.0;
        boolean allObjective = true;

        for (final Question question : activeQuestions) {
            final double qMarks = question.getMarks() != null ? question.getMarks() : 1.0;
            maxScore += qMarks;

            if (question.getQuestionType() == QuestionType.MULTIPLE_CHOICE || question.getQuestionType() == QuestionType.TRUE_FALSE) {
                final StudentAnswer answer = answerMap.get(question.getId());
                if (answer != null && answer.getSelectedOptionId() != null) {
                    final Optional<QuestionOption> optionOpt = optionRepository.findById(answer.getSelectedOptionId());
                    if (optionOpt.isPresent() && Boolean.TRUE.equals(optionOpt.get().getCorrect())) {
                        answer.setCorrect(true);
                        answer.setMarksAwarded(qMarks);
                        totalScore += qMarks;
                    } else {
                        answer.setCorrect(false);
                        final double negMarks = calculateNegativeMarks(assessment, question);
                        answer.setMarksAwarded(-negMarks);
                        totalScore -= negMarks;
                    }
                    answerRepository.save(answer);
                }
            } else {
                allObjective = false;
            }
        }

        // Clamp minimum score at 0.0
        final double finalScore = Math.max(0.0, totalScore);
        attempt.setScore(finalScore);
        attempt.setMaximumScore(maxScore);

        final double percentage = maxScore > 0 ? (finalScore / maxScore) * 100.0 : 0.0;
        attempt.setPercentage(Math.round(percentage * 100.0) / 100.0);

        if (assessment.getPassingMarks() != null && assessment.getPassingMarks() > 0) {
            if (assessment.getPassingMarks() <= maxScore) {
                attempt.setPassed(finalScore >= assessment.getPassingMarks());
            } else {
                // If passingMarks is given as a percentage (e.g. 50%) or exceeds maxScore
                final double requiredScore = (assessment.getPassingMarks() / 100.0) * maxScore;
                attempt.setPassed(finalScore >= requiredScore || percentage >= 40.0);
            }
        } else {
            attempt.setPassed(percentage >= 40.0);
        }

        if (allObjective) {
            attempt.setEvaluationCompleted(true);
            attempt.setStatus(AttemptStatus.EVALUATED);
        } else {
            attempt.setEvaluationCompleted(false);
        }
    }

    private double calculateNegativeMarks(final Assessment assessment, final Question question) {
        if (question.getNegativeMarks() != null && question.getNegativeMarks() > 0) {
            return question.getNegativeMarks();
        }
        if (Boolean.TRUE.equals(assessment.getNegativeMarkingEnabled()) && assessment.getNegativeMarksPerQuestion() != null) {
            return assessment.getNegativeMarksPerQuestion();
        }
        return 0.0;
    }
}

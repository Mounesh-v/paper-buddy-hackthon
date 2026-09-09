package com.scholaros.homework.service;

import com.scholaros.homework.dto.CreateOptionRequest;
import com.scholaros.homework.dto.CreateQuestionRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.QuestionResponse;
import com.scholaros.homework.dto.UpdateQuestionRequest;
import com.scholaros.homework.entity.Assessment;
import com.scholaros.homework.entity.AssessmentStatus;
import com.scholaros.homework.entity.Question;
import com.scholaros.homework.entity.QuestionOption;
import com.scholaros.homework.entity.QuestionType;
import com.scholaros.homework.exception.BadRequestException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.QuestionMapper;
import com.scholaros.homework.repository.AssessmentRepository;
import com.scholaros.homework.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final AssessmentRepository assessmentRepository;
    private final QuestionMapper questionMapper;

    @Override
    @Transactional
    public QuestionResponse createQuestion(final CreateQuestionRequest request) {
        log.info("Creating question for assessmentId: {}", request.getAssessmentId());

        final Assessment assessment = assessmentRepository.findByIdAndActiveTrue(request.getAssessmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", request.getAssessmentId()));

        if (assessment.getStatus() == AssessmentStatus.PUBLISHED) {
            throw new BadRequestException("Cannot add questions to a published assessment");
        }

        validateQuestionMarks(request.getMarks(), request.getNegativeMarks());

        final Question question = questionMapper.toEntity(request);
        question.setAssessment(assessment);
        if (question.getActive() == null) {
            question.setActive(true);
        }

        // Options handling
        final List<QuestionOption> optionsList = new ArrayList<>();
        if (request.getQuestionType() == QuestionType.TRUE_FALSE) {
            optionsList.add(QuestionOption.builder().question(question).optionText("True").correct(true).displayOrder(1).build());
            optionsList.add(QuestionOption.builder().question(question).optionText("False").correct(false).displayOrder(2).build());
        } else if (request.getOptions() != null && !request.getOptions().isEmpty()) {
            int order = 1;
            for (final CreateOptionRequest optReq : request.getOptions()) {
                optionsList.add(QuestionOption.builder()
                        .question(question)
                        .optionText(optReq.getOptionText())
                        .correct(Boolean.TRUE.equals(optReq.getCorrect()))
                        .displayOrder(optReq.getDisplayOrder() != null ? optReq.getDisplayOrder() : order++)
                        .build());
            }
        }

        if (request.getQuestionType() == QuestionType.MULTIPLE_CHOICE) {
            validateMcqOptions(optionsList);
        }

        question.setOptions(optionsList);
        final Question saved = questionRepository.save(question);

        // Recalculate total marks for the assessment
        recalculateTotalMarks(assessment);

        log.info("Question created successfully with ID: {}", saved.getId());
        return questionMapper.toResponse(saved);
    }

    @Override
    public QuestionResponse getQuestionById(final UUID id) {
        log.debug("Fetching question by ID: {}", id);
        final Question question = questionRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", id));
        return questionMapper.toResponse(question);
    }

    @Override
    public List<QuestionResponse> getQuestionsByAssessment(final UUID assessmentId) {
        log.debug("Fetching questions for assessmentId: {}", assessmentId);
        if (!assessmentRepository.existsById(assessmentId)) {
            throw new ResourceNotFoundException("Assessment", "id", assessmentId);
        }
        return questionRepository.findByAssessmentIdAndActiveTrueOrderByDisplayOrderAsc(assessmentId).stream()
                .map(questionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PageResponse<QuestionResponse> getQuestionsByAssessment(final UUID assessmentId, final Pageable pageable) {
        log.debug("Fetching paginated questions for assessmentId: {}", assessmentId);
        if (!assessmentRepository.existsById(assessmentId)) {
            throw new ResourceNotFoundException("Assessment", "id", assessmentId);
        }
        final Page<QuestionResponse> page = questionRepository.findByAssessmentIdAndActiveTrue(assessmentId, pageable)
                .map(questionMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional
    public QuestionResponse updateQuestion(final UUID id, final UpdateQuestionRequest request) {
        log.info("Updating question ID: {}", id);
        final Question question = questionRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", id));

        if (question.getAssessment().getStatus() == AssessmentStatus.PUBLISHED) {
            throw new BadRequestException("Cannot modify questions for a published assessment");
        }

        final Integer updatedMarks = request.getMarks() != null ? request.getMarks() : question.getMarks();
        final Double updatedNegativeMarks = request.getNegativeMarks() != null ? request.getNegativeMarks() : question.getNegativeMarks();
        validateQuestionMarks(updatedMarks, updatedNegativeMarks);

        questionMapper.updateEntityFromRequest(request, question);
        final Question saved = questionRepository.save(question);

        recalculateTotalMarks(question.getAssessment());

        log.info("Question updated successfully with ID: {}", saved.getId());
        return questionMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteQuestion(final UUID id) {
        log.info("Soft deleting question ID: {}", id);
        final Question question = questionRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", id));

        if (question.getAssessment().getStatus() == AssessmentStatus.PUBLISHED) {
            throw new BadRequestException("Cannot delete questions from a published assessment");
        }

        question.setActive(false);
        questionRepository.save(question);

        recalculateTotalMarks(question.getAssessment());
        log.info("Question soft deleted with ID: {}", id);
    }

    private void validateQuestionMarks(final Integer marks, final Double negativeMarks) {
        if (marks != null && marks <= 0) {
            throw new BadRequestException("Question marks must be a positive integer");
        }
        if (negativeMarks != null && marks != null && negativeMarks > marks) {
            throw new BadRequestException("Negative marks (" + negativeMarks + ") cannot exceed question marks (" + marks + ")");
        }
    }

    private void validateMcqOptions(final List<QuestionOption> options) {
        if (options == null || options.size() < 2) {
            throw new BadRequestException("Multiple Choice questions must have at least 2 options");
        }
        final long correctCount = options.stream().filter(o -> Boolean.TRUE.equals(o.getCorrect())).count();
        if (correctCount != 1) {
            throw new BadRequestException("Multiple Choice questions must have exactly one correct option");
        }
    }

    private void recalculateTotalMarks(final Assessment assessment) {
        final List<Question> activeQuestions = questionRepository.findByAssessmentIdAndActiveTrueOrderByDisplayOrderAsc(assessment.getId());
        final int sum = activeQuestions.stream().mapToInt(q -> q.getMarks() != null ? q.getMarks() : 0).sum();
        assessment.setTotalMarks(sum);
        assessmentRepository.save(assessment);
    }
}

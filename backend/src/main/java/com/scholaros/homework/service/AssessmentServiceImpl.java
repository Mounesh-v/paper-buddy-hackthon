package com.scholaros.homework.service;

import com.scholaros.homework.dto.AssessmentConfigurationRequest;
import com.scholaros.homework.dto.AssessmentResponse;
import com.scholaros.homework.dto.AssessmentSearchRequest;
import com.scholaros.homework.dto.CreateAssessmentRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateAssessmentRequest;
import com.scholaros.homework.entity.Assessment;
import com.scholaros.homework.entity.AssessmentConfiguration;
import com.scholaros.homework.entity.AssessmentStatus;
import com.scholaros.homework.entity.LessonSession;
import com.scholaros.homework.entity.LessonStatus;
import com.scholaros.homework.exception.BadRequestException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.AssessmentConfigurationMapper;
import com.scholaros.homework.mapper.AssessmentMapper;
import com.scholaros.homework.repository.AssessmentRepository;
import com.scholaros.homework.repository.AssessmentSpecification;
import com.scholaros.homework.repository.LessonSessionRepository;
import com.scholaros.homework.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssessmentServiceImpl implements AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final LessonSessionRepository lessonSessionRepository;
    private final QuestionRepository questionRepository;
    private final AssessmentMapper assessmentMapper;
    private final AssessmentConfigurationMapper configurationMapper;

    @Override
    @Transactional
    public AssessmentResponse createAssessment(final CreateAssessmentRequest request) {
        log.info("Creating assessment for lessonSessionId: {}", request.getLessonSessionId());

        final LessonSession lessonSession = lessonSessionRepository.findByIdAndActiveTrue(request.getLessonSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("LessonSession", "id", request.getLessonSessionId()));

        if (lessonSession.getStatus() != LessonStatus.COMPLETED) {
            throw new BadRequestException("Assessments can only be created for COMPLETED lesson sessions");
        }

        validateAvailabilityDates(request.getAvailableFrom(), request.getAvailableUntil());

        final Assessment assessment = assessmentMapper.toEntity(request);
        assessment.setLessonSession(lessonSession);
        assessment.setStatus(AssessmentStatus.DRAFT);
        if (assessment.getAllowMultipleAttempts() == null) assessment.setAllowMultipleAttempts(false);
        if (assessment.getShowCorrectAnswers() == null) assessment.setShowCorrectAnswers(true);
        if (assessment.getShuffleQuestions() == null) assessment.setShuffleQuestions(false);
        if (assessment.getShuffleOptions() == null) assessment.setShuffleOptions(false);
        if (assessment.getNegativeMarkingEnabled() == null) assessment.setNegativeMarkingEnabled(false);
        if (assessment.getNegativeMarksPerQuestion() == null) assessment.setNegativeMarksPerQuestion(0.0);
        if (assessment.getTotalMarks() == null) assessment.setTotalMarks(0);
        if (assessment.getActive() == null) assessment.setActive(true);

        // Configuration setup
        final AssessmentConfiguration config;
        if (request.getConfiguration() != null) {
            config = configurationMapper.toEntity(request.getConfiguration());
        } else {
            config = AssessmentConfiguration.builder().build();
        }
        config.setAssessment(assessment);
        assessment.setConfiguration(config);

        final Assessment saved = assessmentRepository.save(assessment);
        log.info("Assessment created successfully with ID: {}", saved.getId());
        return assessmentMapper.toResponse(saved);
    }

    @Override
    public AssessmentResponse getAssessmentById(final UUID id) {
        log.debug("Fetching assessment by ID: {}", id);
        final Assessment assessment = assessmentRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", id));
        return assessmentMapper.toResponse(assessment);
    }

    @Override
    public PageResponse<AssessmentResponse> getAllAssessments(final Pageable pageable) {
        log.debug("Fetching all active assessments");
        final Page<AssessmentResponse> page = assessmentRepository.findByActiveTrue(pageable)
                .map(assessmentMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    public PageResponse<AssessmentResponse> searchAssessments(final AssessmentSearchRequest searchRequest, final Pageable pageable) {
        log.debug("Searching assessments with filters");
        final Specification<Assessment> spec = AssessmentSpecification.buildSpecification(searchRequest);
        final Page<AssessmentResponse> page = assessmentRepository.findAll(spec, pageable)
                .map(assessmentMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional
    public AssessmentResponse updateAssessment(final UUID id, final UpdateAssessmentRequest request) {
        log.info("Updating assessment ID: {}", id);
        final Assessment assessment = assessmentRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", id));

        if (assessment.getStatus() == AssessmentStatus.PUBLISHED) {
            throw new BadRequestException("Published assessments cannot be modified except for status changes");
        }

        final LocalDateTime from = request.getAvailableFrom() != null ? request.getAvailableFrom() : assessment.getAvailableFrom();
        final LocalDateTime until = request.getAvailableUntil() != null ? request.getAvailableUntil() : assessment.getAvailableUntil();
        validateAvailabilityDates(from, until);

        assessmentMapper.updateEntityFromRequest(request, assessment);

        if (request.getConfiguration() != null) {
            if (assessment.getConfiguration() == null) {
                final AssessmentConfiguration config = configurationMapper.toEntity(request.getConfiguration());
                config.setAssessment(assessment);
                assessment.setConfiguration(config);
            } else {
                configurationMapper.updateEntityFromRequest(request.getConfiguration(), assessment.getConfiguration());
            }
        }

        final Assessment saved = assessmentRepository.save(assessment);
        log.info("Assessment updated successfully with ID: {}", saved.getId());
        return assessmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public AssessmentResponse publishAssessment(final UUID id) {
        log.info("Publishing assessment ID: {}", id);
        final Assessment assessment = assessmentRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", id));

        if (assessment.getStatus() == AssessmentStatus.PUBLISHED) {
            throw new BadRequestException("Assessment is already PUBLISHED");
        }

        final long questionCount = questionRepository.countByAssessmentIdAndActiveTrue(id);
        if (questionCount == 0) {
            throw new BadRequestException("Cannot publish assessment without questions");
        }

        assessment.setStatus(AssessmentStatus.PUBLISHED);
        final Assessment saved = assessmentRepository.save(assessment);
        log.info("Assessment published successfully with ID: {}", saved.getId());
        return assessmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public AssessmentResponse closeAssessment(final UUID id) {
        log.info("Closing assessment ID: {}", id);
        final Assessment assessment = assessmentRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", id));

        assessment.setStatus(AssessmentStatus.CLOSED);
        final Assessment saved = assessmentRepository.save(assessment);
        log.info("Assessment closed successfully with ID: {}", saved.getId());
        return assessmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public AssessmentResponse cancelAssessment(final UUID id) {
        log.info("Cancelling assessment ID: {}", id);
        final Assessment assessment = assessmentRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", id));

        assessment.setStatus(AssessmentStatus.CANCELLED);
        final Assessment saved = assessmentRepository.save(assessment);
        log.info("Assessment cancelled successfully with ID: {}", saved.getId());
        return assessmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteAssessment(final UUID id) {
        log.info("Soft deleting assessment ID: {}", id);
        final Assessment assessment = assessmentRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment", "id", id));
        assessment.setActive(false);
        assessmentRepository.save(assessment);
        log.info("Assessment soft deleted with ID: {}", id);
    }

    private void validateAvailabilityDates(final LocalDateTime availableFrom, final LocalDateTime availableUntil) {
        if (availableFrom != null && availableUntil != null && !availableUntil.isAfter(availableFrom)) {
            throw new BadRequestException("Assessment availability end date must be strictly after start date");
        }
    }
}

package com.scholaros.homework.service;

import com.scholaros.homework.dto.HomeworkSubmissionRequest;
import com.scholaros.homework.dto.HomeworkSubmissionResponse;
import com.scholaros.homework.entity.HomeworkAssignment;
import com.scholaros.homework.entity.HomeworkStatus;
import com.scholaros.homework.entity.HomeworkSubmission;
import com.scholaros.homework.exception.BadRequestException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.HomeworkSubmissionMapper;
import com.scholaros.homework.repository.HomeworkAssignmentRepository;
import com.scholaros.homework.repository.HomeworkSubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HomeworkSubmissionServiceImpl implements HomeworkSubmissionService {

    private final HomeworkSubmissionRepository submissionRepository;
    private final HomeworkAssignmentRepository assignmentRepository;
    private final HomeworkFeedbackService feedbackService;
    private final HomeworkSubmissionMapper submissionMapper;

    @Override
    @Transactional
    public HomeworkSubmissionResponse submitHomework(final UUID homeworkAssignmentId, final HomeworkSubmissionRequest request) {
        log.info("Submitting homework assignment ID: {}", homeworkAssignmentId);

        final HomeworkAssignment assignment = assignmentRepository.findByIdAndActiveTrue(homeworkAssignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("HomeworkAssignment", "id", homeworkAssignmentId));

        if (submissionRepository.existsByHomeworkAssignmentId(homeworkAssignmentId)) {
            throw new BadRequestException("Homework has already been submitted and cannot be submitted twice");
        }

        if (assignment.getStatus() == HomeworkStatus.CANCELLED) {
            throw new BadRequestException("Cannot submit a cancelled homework assignment");
        }

        final LocalDateTime now = LocalDateTime.now();
        final boolean isLate = now.isAfter(assignment.getDueDate());

        final int totalQ = assignment.getTotalQuestions() != null ? assignment.getTotalQuestions() : 5;
        final double maxScore = totalQ * 2.0;
        final double score = maxScore; // Fully completed practice questions
        final double percentage = 100.0;

        final HomeworkSubmission submission = HomeworkSubmission.builder()
                .homeworkAssignment(assignment)
                .submittedAt(now)
                .timeTakenMinutes(request != null && request.getTimeTakenMinutes() != null ? request.getTimeTakenMinutes() : assignment.getEstimatedDurationMinutes())
                .score(score)
                .maximumScore(maxScore)
                .percentage(percentage)
                .submitted(true)
                .lateSubmission(isLate)
                .autoEvaluated(true)
                .remarks(request != null ? request.getRemarks() : null)
                .build();

        final HomeworkSubmission saved = submissionRepository.save(submission);

        // Update assignment completion state
        assignment.setCompletedQuestions(totalQ);
        assignment.setCompletionPercentage(100.0);
        assignment.setStatus(isLate ? HomeworkStatus.OVERDUE : HomeworkStatus.COMPLETED);
        assignmentRepository.save(assignment);

        // Generate automated feedback
        feedbackService.generateFeedbackForSubmission(saved);

        log.info("Homework submission completed with ID: {}", saved.getId());
        return submissionMapper.toResponse(saved);
    }

    @Override
    public HomeworkSubmissionResponse getSubmissionByHomeworkId(final UUID homeworkAssignmentId) {
        log.debug("Fetching submission for homework ID: {}", homeworkAssignmentId);
        final HomeworkSubmission submission = submissionRepository.findByHomeworkAssignmentId(homeworkAssignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("HomeworkSubmission", "homeworkAssignmentId", homeworkAssignmentId));
        return submissionMapper.toResponse(submission);
    }
}

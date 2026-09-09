package com.scholaros.homework.service;

import com.scholaros.homework.dto.CreateHomeworkRequest;
import com.scholaros.homework.dto.HomeworkAssignmentResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateHomeworkRequest;
import com.scholaros.homework.entity.HomeworkAssignment;
import com.scholaros.homework.entity.HomeworkRecommendation;
import com.scholaros.homework.entity.HomeworkStatus;
import com.scholaros.homework.entity.LessonSession;
import com.scholaros.homework.exception.BadRequestException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.HomeworkAssignmentMapper;
import com.scholaros.homework.repository.HomeworkAssignmentRepository;
import com.scholaros.homework.repository.HomeworkAssignmentSpecification;
import com.scholaros.homework.repository.HomeworkRecommendationRepository;
import com.scholaros.homework.repository.LessonSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HomeworkAssignmentServiceImpl implements HomeworkAssignmentService {

    private final HomeworkAssignmentRepository assignmentRepository;
    private final LessonSessionRepository lessonSessionRepository;
    private final HomeworkRecommendationRepository recommendationRepository;
    private final HomeworkAssignmentMapper assignmentMapper;

    @Override
    @Transactional
    public HomeworkAssignmentResponse createHomework(final CreateHomeworkRequest request) {
        log.info("Creating homework assignment for student ID: {}", request.getStudentId());

        final LessonSession lessonSession = lessonSessionRepository.findByIdAndActiveTrue(request.getLessonSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("LessonSession", "id", request.getLessonSessionId()));

        final HomeworkRecommendation rec = recommendationRepository.findById(request.getHomeworkRecommendationId())
                .orElseThrow(() -> new ResourceNotFoundException("HomeworkRecommendation", "id", request.getHomeworkRecommendationId()));

        if (assignmentRepository.existsByHomeworkRecommendationIdAndActiveTrue(request.getHomeworkRecommendationId())) {
            throw new BadRequestException("A homework assignment has already been created from this recommendation");
        }

        final LocalDateTime now = LocalDateTime.now();
        if (!request.getDueDate().isAfter(now)) {
            throw new BadRequestException("Due date must be after the assigned date");
        }

        final HomeworkAssignment assignment = assignmentMapper.toEntity(request);
        assignment.setLessonSession(lessonSession);
        assignment.setHomeworkRecommendation(rec);
        assignment.setAssignedDate(now);
        assignment.setStatus(HomeworkStatus.ASSIGNED);
        assignment.setGeneratedByAI(false);
        if (assignment.getActive() == null) {
            assignment.setActive(true);
        }

        final HomeworkAssignment saved = assignmentRepository.save(assignment);
        log.info("Homework assignment created successfully with ID: {}", saved.getId());
        return assignmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public HomeworkAssignmentResponse getHomeworkById(final UUID id) {
        log.debug("Fetching homework assignment by ID: {}", id);
        checkAndUpdateOverdue(id);

        final HomeworkAssignment assignment = assignmentRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("HomeworkAssignment", "id", id));
        return assignmentMapper.toResponse(assignment);
    }

    @Override
    @Transactional
    public PageResponse<HomeworkAssignmentResponse> getHomeworkByStudent(final UUID studentId, final Pageable pageable) {
        log.debug("Fetching homework assignments for student ID: {}", studentId);
        checkAndUpdateAllOverdue();

        final Page<HomeworkAssignmentResponse> page = assignmentRepository.findByStudentIdAndActiveTrue(studentId, pageable)
                .map(assignmentMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional
    public PageResponse<HomeworkAssignmentResponse> getHomeworkByTeacher(final UUID teacherId, final Pageable pageable) {
        log.debug("Fetching homework assignments for teacher ID: {}", teacherId);
        checkAndUpdateAllOverdue();

        final Page<HomeworkAssignmentResponse> page = assignmentRepository.findByTeacherIdAndActiveTrue(teacherId, pageable)
                .map(assignmentMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional
    public PageResponse<HomeworkAssignmentResponse> searchHomework(
            final UUID studentId,
            final UUID teacherId,
            final UUID lessonSessionId,
            final HomeworkStatus status,
            final LocalDateTime dueDate,
            final Pageable pageable
    ) {
        log.debug("Searching homework assignments");
        checkAndUpdateAllOverdue();

        final Specification<HomeworkAssignment> spec = HomeworkAssignmentSpecification.buildSpecification(studentId, teacherId, lessonSessionId, status, dueDate);
        final Page<HomeworkAssignmentResponse> page = assignmentRepository.findAll(spec, pageable)
                .map(assignmentMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional
    public HomeworkAssignmentResponse updateHomework(final UUID id, final UpdateHomeworkRequest request) {
        log.info("Updating homework assignment ID: {}", id);

        final HomeworkAssignment assignment = assignmentRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("HomeworkAssignment", "id", id));

        if (assignment.getStatus() == HomeworkStatus.SUBMITTED || assignment.getStatus() == HomeworkStatus.COMPLETED) {
            throw new BadRequestException("Submitted or completed homework cannot be modified");
        }

        if (request.getDueDate() != null && !request.getDueDate().isAfter(assignment.getAssignedDate())) {
            throw new BadRequestException("Due date must be after the assigned date");
        }

        assignmentMapper.updateEntityFromRequest(request, assignment);
        final HomeworkAssignment saved = assignmentRepository.save(assignment);
        log.info("Homework assignment updated successfully with ID: {}", saved.getId());
        return assignmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public HomeworkAssignmentResponse publishHomework(final UUID id) {
        log.info("Publishing homework assignment ID: {}", id);

        final HomeworkAssignment assignment = assignmentRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("HomeworkAssignment", "id", id));

        assignment.setStatus(HomeworkStatus.ASSIGNED);
        final HomeworkAssignment saved = assignmentRepository.save(assignment);
        log.info("Homework assignment published with ID: {}", saved.getId());
        return assignmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteHomework(final UUID id) {
        log.info("Soft deleting homework assignment ID: {}", id);

        final HomeworkAssignment assignment = assignmentRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("HomeworkAssignment", "id", id));
        assignment.setActive(false);
        assignmentRepository.save(assignment);
        log.info("Homework assignment soft deleted with ID: {}", id);
    }

    private void checkAndUpdateOverdue(final UUID id) {
        assignmentRepository.findByIdAndActiveTrue(id).ifPresent(assignment -> {
            if ((assignment.getStatus() == HomeworkStatus.ASSIGNED || assignment.getStatus() == HomeworkStatus.IN_PROGRESS)
                    && LocalDateTime.now().isAfter(assignment.getDueDate())) {
                assignment.setStatus(HomeworkStatus.OVERDUE);
                assignmentRepository.save(assignment);
            }
        });
    }

    private void checkAndUpdateAllOverdue() {
        final List<HomeworkAssignment> overdueList = assignmentRepository.findByStatusInAndDueDateBeforeAndActiveTrue(
                Arrays.asList(HomeworkStatus.ASSIGNED, HomeworkStatus.IN_PROGRESS), LocalDateTime.now());
        for (final HomeworkAssignment assignment : overdueList) {
            assignment.setStatus(HomeworkStatus.OVERDUE);
        }
        if (!overdueList.isEmpty()) {
            assignmentRepository.saveAll(overdueList);
        }
    }
}

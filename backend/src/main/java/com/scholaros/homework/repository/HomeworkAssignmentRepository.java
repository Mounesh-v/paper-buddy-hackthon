package com.scholaros.homework.repository;

import com.scholaros.homework.entity.HomeworkAssignment;
import com.scholaros.homework.entity.HomeworkStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HomeworkAssignmentRepository extends JpaRepository<HomeworkAssignment, UUID>, JpaSpecificationExecutor<HomeworkAssignment> {

    Optional<HomeworkAssignment> findByIdAndActiveTrue(UUID id);

    Page<HomeworkAssignment> findByStudentIdAndActiveTrue(UUID studentId, Pageable pageable);

    Page<HomeworkAssignment> findByTeacherIdAndActiveTrue(UUID teacherId, Pageable pageable);

    Page<HomeworkAssignment> findByLessonSessionIdAndActiveTrue(UUID lessonSessionId, Pageable pageable);

    Page<HomeworkAssignment> findByStatusAndActiveTrue(HomeworkStatus status, Pageable pageable);

    List<HomeworkAssignment> findByStatusInAndDueDateBeforeAndActiveTrue(List<HomeworkStatus> statuses, LocalDateTime now);

    boolean existsByHomeworkRecommendationIdAndActiveTrue(UUID homeworkRecommendationId);
}

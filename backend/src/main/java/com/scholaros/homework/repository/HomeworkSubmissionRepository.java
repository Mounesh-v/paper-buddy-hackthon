package com.scholaros.homework.repository;

import com.scholaros.homework.entity.HomeworkSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface HomeworkSubmissionRepository extends JpaRepository<HomeworkSubmission, UUID> {

    Optional<HomeworkSubmission> findByHomeworkAssignmentId(UUID homeworkAssignmentId);

    boolean existsByHomeworkAssignmentId(UUID homeworkAssignmentId);
}

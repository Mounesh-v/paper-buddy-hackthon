package com.scholaros.homework.repository;

import com.scholaros.homework.entity.HomeworkFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface HomeworkFeedbackRepository extends JpaRepository<HomeworkFeedback, UUID> {

    Optional<HomeworkFeedback> findByHomeworkSubmissionId(UUID homeworkSubmissionId);

    Optional<HomeworkFeedback> findByHomeworkSubmissionHomeworkAssignmentId(UUID homeworkAssignmentId);
}

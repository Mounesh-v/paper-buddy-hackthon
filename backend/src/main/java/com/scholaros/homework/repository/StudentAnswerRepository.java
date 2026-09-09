package com.scholaros.homework.repository;

import com.scholaros.homework.entity.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, UUID> {

    List<StudentAnswer> findByAttemptId(UUID attemptId);

    Optional<StudentAnswer> findByAttemptIdAndQuestionId(UUID attemptId, UUID questionId);

    void deleteByAttemptId(UUID attemptId);
}

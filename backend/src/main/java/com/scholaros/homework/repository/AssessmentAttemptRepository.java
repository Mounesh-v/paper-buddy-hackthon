package com.scholaros.homework.repository;

import com.scholaros.homework.entity.AssessmentAttempt;
import com.scholaros.homework.entity.AttemptStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, UUID>, JpaSpecificationExecutor<AssessmentAttempt> {

    Optional<AssessmentAttempt> findByIdAndActiveTrue(UUID id);

    Page<AssessmentAttempt> findByStudentIdAndActiveTrue(UUID studentId, Pageable pageable);

    Page<AssessmentAttempt> findByAssessmentIdAndActiveTrue(UUID assessmentId, Pageable pageable);

    List<AssessmentAttempt> findByAssessmentIdAndStudentIdAndActiveTrueOrderByAttemptNumberDesc(UUID assessmentId, UUID studentId);

    Optional<AssessmentAttempt> findTopByAssessmentIdAndStudentIdAndActiveTrueOrderByAttemptNumberDesc(UUID assessmentId, UUID studentId);

    long countByAssessmentIdAndStudentIdAndActiveTrue(UUID assessmentId, UUID studentId);

    Page<AssessmentAttempt> findByStatusAndActiveTrue(AttemptStatus status, Pageable pageable);
}

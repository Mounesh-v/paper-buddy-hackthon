package com.scholaros.homework.repository;

import com.scholaros.homework.entity.LearningAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LearningAnalysisRepository extends JpaRepository<LearningAnalysis, UUID> {

    Optional<LearningAnalysis> findByAssessmentAttemptId(UUID assessmentAttemptId);

    boolean existsByAssessmentAttemptId(UUID assessmentAttemptId);
}

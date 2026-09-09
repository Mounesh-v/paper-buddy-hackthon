package com.scholaros.homework.repository;

import com.scholaros.homework.entity.HomeworkRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface HomeworkRecommendationRepository extends JpaRepository<HomeworkRecommendation, UUID> {

    Optional<HomeworkRecommendation> findByLearningAnalysisId(UUID learningAnalysisId);

    Optional<HomeworkRecommendation> findByLearningAnalysisAssessmentAttemptId(UUID assessmentAttemptId);
}

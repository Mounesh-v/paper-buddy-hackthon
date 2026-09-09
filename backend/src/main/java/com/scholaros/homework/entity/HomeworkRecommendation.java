package com.scholaros.homework.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "homework_recommendations")
public class HomeworkRecommendation extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "learning_analysis_id", nullable = false, unique = true)
    private LearningAnalysis learningAnalysis;

    @Enumerated(EnumType.STRING)
    @Column(name = "recommended_difficulty", length = 30)
    private DifficultyLevel recommendedDifficulty;

    @Builder.Default
    @Column(name = "recommended_question_count", nullable = false)
    private Integer recommendedQuestionCount = 5;

    @Builder.Default
    @Column(name = "recommended_practice_minutes", nullable = false)
    private Integer recommendedPracticeMinutes = 15;

    @Column(name = "recommended_topics", columnDefinition = "TEXT")
    private String recommendedTopics;

    @Column(name = "recommended_question_types", columnDefinition = "TEXT")
    private String recommendedQuestionTypes;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "priority_level", nullable = false, length = 30)
    private RecommendationPriority priorityLevel = RecommendationPriority.MEDIUM;

    @Column(name = "recommendation_reason", columnDefinition = "TEXT")
    private String recommendationReason;
}

package com.scholaros.homework.entity;

import jakarta.persistence.CascadeType;
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

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "learning_analyses")
public class LearningAnalysis extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_attempt_id", nullable = false, unique = true)
    private AssessmentAttempt assessmentAttempt;

    @Builder.Default
    @Column(name = "overall_mastery_percentage", nullable = false)
    private Double overallMasteryPercentage = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "mastery_level", nullable = false, length = 30)
    private MasteryLevel masteryLevel;

    @Column(name = "strong_concepts", columnDefinition = "TEXT")
    private String strongConcepts;

    @Column(name = "weak_concepts", columnDefinition = "TEXT")
    private String weakConcepts;

    @Column(name = "misconceptions", columnDefinition = "TEXT")
    private String misconceptions;

    @Builder.Default
    @Column(name = "confidence_score")
    private Double confidenceScore = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "recommended_difficulty", length = 30)
    private DifficultyLevel recommendedDifficulty;

    @Column(name = "recommended_study_minutes")
    private Integer recommendedStudyMinutes;

    @Column(name = "analysis_summary", columnDefinition = "TEXT")
    private String analysisSummary;

    @Column(name = "ai_model", length = 100)
    private String aiModel;

    @Column(name = "analysis_timestamp", nullable = false)
    private LocalDateTime analysisTimestamp;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @OneToOne(mappedBy = "learningAnalysis", cascade = CascadeType.ALL, orphanRemoval = true)
    private HomeworkRecommendation recommendation;
}

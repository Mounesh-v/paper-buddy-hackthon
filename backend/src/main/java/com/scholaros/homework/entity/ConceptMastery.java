package com.scholaros.homework.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "concept_masteries")
public class ConceptMastery extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "learning_record_id", nullable = false)
    private LearningRecord learningRecord;

    @Column(name = "concept_name", nullable = false, length = 200)
    private String conceptName;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "mastery_level", nullable = false, length = 30)
    private MasteryStatus masteryLevel = MasteryStatus.DEVELOPING;

    @Builder.Default
    @Column(name = "mastery_percentage", nullable = false)
    private Double masteryPercentage = 0.0;

    @Builder.Default
    @Column(name = "attempt_count", nullable = false)
    private Integer attemptCount = 1;

    @Builder.Default
    @Column(name = "improvement_percentage")
    private Double improvementPercentage = 0.0;

    @Column(name = "last_practiced")
    private LocalDateTime lastPracticed;
}

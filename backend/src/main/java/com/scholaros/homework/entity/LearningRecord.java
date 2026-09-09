package com.scholaros.homework.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "learning_records", uniqueConstraints = {
        @UniqueConstraint(name = "uk_student_topic", columnNames = {"student_id", "topic_id"})
})
public class LearningRecord extends BaseEntity {

    // ERP references (stored as UUID, no JPA relationship)
    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "section_id", nullable = false)
    private UUID sectionId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "curriculum_id", nullable = false)
    private Curriculum curriculum;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Builder.Default
    @Column(name = "overall_mastery_percentage", nullable = false)
    private Double overallMasteryPercentage = 0.0;

    @Builder.Default
    @Column(name = "average_assessment_score", nullable = false)
    private Double averageAssessmentScore = 0.0;

    @Builder.Default
    @Column(name = "average_homework_score", nullable = false)
    private Double averageHomeworkScore = 0.0;

    @Builder.Default
    @Column(name = "average_completion_rate", nullable = false)
    private Double averageCompletionRate = 0.0;

    @Builder.Default
    @Column(name = "total_assessments", nullable = false)
    private Integer totalAssessments = 0;

    @Builder.Default
    @Column(name = "total_homework", nullable = false)
    private Integer totalHomework = 0;

    @Builder.Default
    @Column(name = "total_study_minutes", nullable = false)
    private Integer totalStudyMinutes = 0;

    @Column(name = "last_assessment_date")
    private LocalDateTime lastAssessmentDate;

    @Column(name = "last_homework_date")
    private LocalDateTime lastHomeworkDate;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Builder.Default
    @OneToMany(mappedBy = "learningRecord", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConceptMastery> conceptMasteries = new ArrayList<>();
}

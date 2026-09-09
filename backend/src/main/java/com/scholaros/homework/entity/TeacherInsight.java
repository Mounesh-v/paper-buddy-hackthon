package com.scholaros.homework.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "teacher_insights")
public class TeacherInsight extends BaseEntity {

    // ERP references
    @Column(name = "teacher_id", nullable = false)
    private UUID teacherId;

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "section_id", nullable = false)
    private UUID sectionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_id")
    private Curriculum curriculum;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @Column(name = "strong_topics", columnDefinition = "TEXT")
    private String strongTopics;

    @Column(name = "weak_topics", columnDefinition = "TEXT")
    private String weakTopics;

    @Column(name = "recommended_revision_topics", columnDefinition = "TEXT")
    private String recommendedRevisionTopics;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;
}

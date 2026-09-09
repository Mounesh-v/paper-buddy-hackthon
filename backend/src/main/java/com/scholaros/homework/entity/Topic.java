package com.scholaros.homework.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(
        name = "topics",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_topics_chapter_name",
                columnNames = {"chapter_id", "topic_name"}
        )
)
public class Topic extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;

    @Column(name = "topic_name", nullable = false, length = 200)
    private String topicName;

    @Column(name = "learning_objectives", columnDefinition = "TEXT")
    private String learningObjectives;

    @Column(name = "keywords", columnDefinition = "TEXT")
    private String keywords;

    @Column(name = "estimated_teaching_minutes")
    private Integer estimatedTeachingMinutes;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", length = 30)
    private DifficultyLevel difficultyLevel;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;
}

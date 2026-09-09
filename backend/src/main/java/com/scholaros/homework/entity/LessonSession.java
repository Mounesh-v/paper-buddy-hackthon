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

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "lesson_sessions")
public class LessonSession extends BaseEntity {

    @Column(name = "lesson_title", nullable = false, length = 200)
    private String lessonTitle;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // ERP references (stored as UUID, no JPA relationship)
    @Column(name = "teacher_id", nullable = false)
    private UUID teacherId;

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "academic_year_id")
    private UUID academicYearId;

    @Column(name = "grade_id")
    private UUID gradeId;

    @Column(name = "section_id", nullable = false)
    private UUID sectionId;

    // JPA relationships to Curriculum, Chapter, and Topic
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "curriculum_id", nullable = false)
    private Curriculum curriculum;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chapter_id", nullable = false)
    private Chapter chapter;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(name = "lesson_date", nullable = false)
    private LocalDate lessonDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private LessonStatus status = LessonStatus.PLANNED;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "teaching_mode", nullable = false, length = 30)
    private TeachingMode teachingMode = TeachingMode.OFFLINE;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;
}

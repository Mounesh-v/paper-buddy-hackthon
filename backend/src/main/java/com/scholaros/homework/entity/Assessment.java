package com.scholaros.homework.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "assessments")
public class Assessment extends BaseEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_session_id", nullable = false)
    private LessonSession lessonSession;

    @Enumerated(EnumType.STRING)
    @Column(name = "assessment_type", nullable = false, length = 30)
    private AssessmentType assessmentType;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private AssessmentStatus status = AssessmentStatus.DRAFT;

    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Builder.Default
    @Column(name = "total_marks", nullable = false)
    private Integer totalMarks = 0;

    @Column(name = "passing_marks")
    private Integer passingMarks;

    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes;

    @Column(name = "available_from")
    private LocalDateTime availableFrom;

    @Column(name = "available_until")
    private LocalDateTime availableUntil;

    @Builder.Default
    @Column(name = "allow_multiple_attempts", nullable = false)
    private Boolean allowMultipleAttempts = false;

    @Builder.Default
    @Column(name = "show_correct_answers", nullable = false)
    private Boolean showCorrectAnswers = true;

    @Builder.Default
    @Column(name = "shuffle_questions", nullable = false)
    private Boolean shuffleQuestions = false;

    @Builder.Default
    @Column(name = "shuffle_options", nullable = false)
    private Boolean shuffleOptions = false;

    @Builder.Default
    @Column(name = "negative_marking_enabled", nullable = false)
    private Boolean negativeMarkingEnabled = false;

    @Builder.Default
    @Column(name = "negative_marks_per_question")
    private Double negativeMarksPerQuestion = 0.0;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @OneToOne(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true)
    private AssessmentConfiguration configuration;

    @Builder.Default
    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();
}

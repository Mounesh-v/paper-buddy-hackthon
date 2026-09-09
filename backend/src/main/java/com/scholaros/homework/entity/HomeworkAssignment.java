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
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "homework_assignments")
public class HomeworkAssignment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_session_id", nullable = false)
    private LessonSession lessonSession;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "homework_recommendation_id", nullable = false, unique = true)
    private HomeworkRecommendation homeworkRecommendation;

    // ERP references (stored as UUID, no JPA relationship)
    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "teacher_id", nullable = false)
    private UUID teacherId;

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "section_id", nullable = false)
    private UUID sectionId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", length = 30)
    private DifficultyLevel difficultyLevel;

    @Builder.Default
    @Column(name = "estimated_duration_minutes", nullable = false)
    private Integer estimatedDurationMinutes = 15;

    @Column(name = "assigned_date", nullable = false)
    private LocalDateTime assignedDate;

    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private HomeworkStatus status = HomeworkStatus.ASSIGNED;

    @Builder.Default
    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions = 0;

    @Builder.Default
    @Column(name = "completed_questions", nullable = false)
    private Integer completedQuestions = 0;

    @Builder.Default
    @Column(name = "completion_percentage")
    private Double completionPercentage = 0.0;

    @Builder.Default
    @Column(name = "generated_by_ai", nullable = false)
    private Boolean generatedByAI = true;

    @Builder.Default
    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Builder.Default
    @OneToMany(mappedBy = "homeworkAssignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HomeworkQuestion> questions = new ArrayList<>();

    @OneToOne(mappedBy = "homeworkAssignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private HomeworkSubmission submission;
}

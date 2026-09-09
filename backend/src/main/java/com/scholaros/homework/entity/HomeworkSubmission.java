package com.scholaros.homework.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "homework_submissions")
public class HomeworkSubmission extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "homework_assignment_id", nullable = false, unique = true)
    private HomeworkAssignment homeworkAssignment;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "time_taken_minutes")
    private Integer timeTakenMinutes;

    @Builder.Default
    @Column(name = "score")
    private Double score = 0.0;

    @Builder.Default
    @Column(name = "maximum_score")
    private Double maximumScore = 0.0;

    @Builder.Default
    @Column(name = "percentage")
    private Double percentage = 0.0;

    @Builder.Default
    @Column(name = "submitted", nullable = false)
    private Boolean submitted = true;

    @Builder.Default
    @Column(name = "late_submission", nullable = false)
    private Boolean lateSubmission = false;

    @Builder.Default
    @Column(name = "auto_evaluated", nullable = false)
    private Boolean autoEvaluated = true;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @OneToOne(mappedBy = "homeworkSubmission", cascade = CascadeType.ALL, orphanRemoval = true)
    private HomeworkFeedback feedback;
}

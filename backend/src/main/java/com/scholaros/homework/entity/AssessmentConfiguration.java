package com.scholaros.homework.entity;

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

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "assessment_configurations")
public class AssessmentConfiguration extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false, unique = true)
    private Assessment assessment;

    @Builder.Default
    @Column(name = "max_attempts", nullable = false)
    private Integer maxAttempts = 1;

    @Builder.Default
    @Column(name = "auto_submit", nullable = false)
    private Boolean autoSubmit = true;

    @Builder.Default
    @Column(name = "randomize_questions", nullable = false)
    private Boolean randomizeQuestions = false;

    @Builder.Default
    @Column(name = "randomize_options", nullable = false)
    private Boolean randomizeOptions = false;

    @Builder.Default
    @Column(name = "display_result_immediately", nullable = false)
    private Boolean displayResultImmediately = true;

    @Builder.Default
    @Column(name = "allow_review_after_submission", nullable = false)
    private Boolean allowReviewAfterSubmission = true;

    @Builder.Default
    @Column(name = "allow_skip_questions", nullable = false)
    private Boolean allowSkipQuestions = true;
}

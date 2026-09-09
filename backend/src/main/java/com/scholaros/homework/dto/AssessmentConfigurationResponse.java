package com.scholaros.homework.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentConfigurationResponse {

    private UUID id;
    private UUID assessmentId;
    private Integer maxAttempts;
    private Boolean autoSubmit;
    private Boolean randomizeQuestions;
    private Boolean randomizeOptions;
    private Boolean displayResultImmediately;
    private Boolean allowReviewAfterSubmission;
    private Boolean allowSkipQuestions;
}

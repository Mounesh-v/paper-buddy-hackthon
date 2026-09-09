package com.scholaros.homework.dto;

import jakarta.validation.constraints.Min;
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
public class AssessmentConfigurationRequest {

    @Min(value = 1, message = "Max attempts must be at least 1")
    private Integer maxAttempts;

    private Boolean autoSubmit;
    private Boolean randomizeQuestions;
    private Boolean randomizeOptions;
    private Boolean displayResultImmediately;
    private Boolean allowReviewAfterSubmission;
    private Boolean allowSkipQuestions;
}

package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scholaros.homework.entity.AssessmentStatus;
import com.scholaros.homework.entity.AssessmentType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
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
public class UpdateAssessmentRequest {

    @Size(max = 200, message = "Assessment title cannot exceed 200 characters")
    private String title;

    private String description;

    private AssessmentType assessmentType;

    private AssessmentStatus status;

    private String instructions;

    @Min(value = 0, message = "Passing marks cannot be negative")
    private Integer passingMarks;

    @Min(value = 1, message = "Estimated duration must be positive")
    private Integer estimatedDurationMinutes;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime availableFrom;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime availableUntil;

    private Boolean allowMultipleAttempts;
    private Boolean showCorrectAnswers;
    private Boolean shuffleQuestions;
    private Boolean shuffleOptions;
    private Boolean negativeMarkingEnabled;

    @Min(value = 0, message = "Negative marks per question cannot be negative")
    private Double negativeMarksPerQuestion;

    private Boolean active;

    @Valid
    private AssessmentConfigurationRequest configuration;
}

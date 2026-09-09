package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scholaros.homework.entity.AssessmentType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class CreateAssessmentRequest {

    @NotBlank(message = "Assessment title is required")
    @Size(max = 200, message = "Assessment title cannot exceed 200 characters")
    private String title;

    private String description;

    @NotNull(message = "Lesson Session ID is required")
    private UUID lessonSessionId;

    @NotNull(message = "Assessment type is required")
    private AssessmentType assessmentType;

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

    @Valid
    private AssessmentConfigurationRequest configuration;
}

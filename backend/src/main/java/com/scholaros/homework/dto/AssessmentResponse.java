package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scholaros.homework.entity.AssessmentStatus;
import com.scholaros.homework.entity.AssessmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentResponse {

    private UUID id;
    private String title;
    private String description;

    private UUID lessonSessionId;
    private String lessonTitle;

    private AssessmentType assessmentType;
    private AssessmentStatus status;
    private String instructions;
    private Integer totalMarks;
    private Integer passingMarks;
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
    private Double negativeMarksPerQuestion;
    private Boolean active;

    private AssessmentConfigurationResponse configuration;
    private List<QuestionResponse> questions;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
}

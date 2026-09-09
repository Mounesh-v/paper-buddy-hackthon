package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scholaros.homework.entity.AttemptStatus;
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
public class AssessmentResultResponse {

    private UUID attemptId;
    private UUID assessmentId;
    private String assessmentTitle;
    private UUID studentId;
    private AttemptStatus status;
    private Double score;
    private Double maximumScore;
    private Double percentage;
    private Integer passingMarks;
    private Boolean passed;
    private Boolean evaluationCompleted;
    private Integer totalQuestions;
    private Integer totalAttempted;
    private Integer totalCorrect;

    // Aliased fields for UI compatibility
    private Double obtainedMarks;
    private Double totalMarks;
    private Integer correctAnswersCount;
    private Integer incorrectAnswersCount;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime submittedAt;

    private List<StudentAnswerResponse> answers;
}

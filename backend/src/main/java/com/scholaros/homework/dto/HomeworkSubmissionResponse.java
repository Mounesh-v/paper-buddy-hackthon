package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
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
public class HomeworkSubmissionResponse {

    private UUID id;
    private UUID homeworkAssignmentId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime submittedAt;

    private Integer timeTakenMinutes;
    private Double score;
    private Double maximumScore;
    private Double percentage;
    private Boolean submitted;
    private Boolean lateSubmission;
    private Boolean autoEvaluated;
    private String remarks;

    private HomeworkFeedbackResponse feedback;
}

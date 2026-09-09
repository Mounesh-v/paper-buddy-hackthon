package com.scholaros.homework.dto;

import com.scholaros.homework.entity.FeedbackSource;
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
public class HomeworkFeedbackResponse {

    private UUID id;
    private UUID homeworkSubmissionId;
    private String feedbackSummary;
    private String strengths;
    private String weaknesses;
    private String nextSteps;
    private String teacherRemarks;
    private FeedbackSource source;
    private Boolean generatedByAI;
}

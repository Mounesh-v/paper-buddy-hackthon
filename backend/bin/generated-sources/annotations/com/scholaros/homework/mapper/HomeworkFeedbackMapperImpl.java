package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.HomeworkFeedbackResponse;
import com.scholaros.homework.entity.HomeworkFeedback;
import com.scholaros.homework.entity.HomeworkSubmission;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-08T18:39:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
)
@Component
public class HomeworkFeedbackMapperImpl implements HomeworkFeedbackMapper {

    @Override
    public HomeworkFeedbackResponse toResponse(HomeworkFeedback feedback) {
        if ( feedback == null ) {
            return null;
        }

        HomeworkFeedbackResponse.HomeworkFeedbackResponseBuilder homeworkFeedbackResponse = HomeworkFeedbackResponse.builder();

        homeworkFeedbackResponse.homeworkSubmissionId( feedbackHomeworkSubmissionId( feedback ) );
        homeworkFeedbackResponse.feedbackSummary( feedback.getFeedbackSummary() );
        homeworkFeedbackResponse.generatedByAI( feedback.getGeneratedByAI() );
        homeworkFeedbackResponse.id( feedback.getId() );
        homeworkFeedbackResponse.nextSteps( feedback.getNextSteps() );
        homeworkFeedbackResponse.source( feedback.getSource() );
        homeworkFeedbackResponse.strengths( feedback.getStrengths() );
        homeworkFeedbackResponse.teacherRemarks( feedback.getTeacherRemarks() );
        homeworkFeedbackResponse.weaknesses( feedback.getWeaknesses() );

        return homeworkFeedbackResponse.build();
    }

    private UUID feedbackHomeworkSubmissionId(HomeworkFeedback homeworkFeedback) {
        HomeworkSubmission homeworkSubmission = homeworkFeedback.getHomeworkSubmission();
        if ( homeworkSubmission == null ) {
            return null;
        }
        return homeworkSubmission.getId();
    }
}

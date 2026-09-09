package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.HomeworkFeedbackResponse;
import com.scholaros.homework.entity.HomeworkFeedback;
import com.scholaros.homework.entity.HomeworkSubmission;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-31T07:08:58+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-java-compiler-worker-9.5.1.jar, environment: Java 21.0.12 (Eclipse Adoptium)"
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
        homeworkFeedbackResponse.id( feedback.getId() );
        homeworkFeedbackResponse.feedbackSummary( feedback.getFeedbackSummary() );
        homeworkFeedbackResponse.strengths( feedback.getStrengths() );
        homeworkFeedbackResponse.weaknesses( feedback.getWeaknesses() );
        homeworkFeedbackResponse.nextSteps( feedback.getNextSteps() );
        homeworkFeedbackResponse.teacherRemarks( feedback.getTeacherRemarks() );
        homeworkFeedbackResponse.source( feedback.getSource() );
        homeworkFeedbackResponse.generatedByAI( feedback.getGeneratedByAI() );

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

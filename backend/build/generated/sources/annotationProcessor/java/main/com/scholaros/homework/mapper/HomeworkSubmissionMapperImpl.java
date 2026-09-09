package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.HomeworkSubmissionResponse;
import com.scholaros.homework.entity.HomeworkAssignment;
import com.scholaros.homework.entity.HomeworkSubmission;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-09T16:58:41+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class HomeworkSubmissionMapperImpl implements HomeworkSubmissionMapper {

    @Autowired
    private HomeworkFeedbackMapper homeworkFeedbackMapper;

    @Override
    public HomeworkSubmissionResponse toResponse(HomeworkSubmission submission) {
        if ( submission == null ) {
            return null;
        }

        HomeworkSubmissionResponse.HomeworkSubmissionResponseBuilder homeworkSubmissionResponse = HomeworkSubmissionResponse.builder();

        homeworkSubmissionResponse.homeworkAssignmentId( submissionHomeworkAssignmentId( submission ) );
        homeworkSubmissionResponse.id( submission.getId() );
        homeworkSubmissionResponse.submittedAt( submission.getSubmittedAt() );
        homeworkSubmissionResponse.timeTakenMinutes( submission.getTimeTakenMinutes() );
        homeworkSubmissionResponse.score( submission.getScore() );
        homeworkSubmissionResponse.maximumScore( submission.getMaximumScore() );
        homeworkSubmissionResponse.percentage( submission.getPercentage() );
        homeworkSubmissionResponse.submitted( submission.getSubmitted() );
        homeworkSubmissionResponse.lateSubmission( submission.getLateSubmission() );
        homeworkSubmissionResponse.autoEvaluated( submission.getAutoEvaluated() );
        homeworkSubmissionResponse.remarks( submission.getRemarks() );
        homeworkSubmissionResponse.feedback( homeworkFeedbackMapper.toResponse( submission.getFeedback() ) );

        return homeworkSubmissionResponse.build();
    }

    private UUID submissionHomeworkAssignmentId(HomeworkSubmission homeworkSubmission) {
        HomeworkAssignment homeworkAssignment = homeworkSubmission.getHomeworkAssignment();
        if ( homeworkAssignment == null ) {
            return null;
        }
        return homeworkAssignment.getId();
    }
}

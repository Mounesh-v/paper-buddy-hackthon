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
    date = "2026-09-08T18:39:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
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
        homeworkSubmissionResponse.autoEvaluated( submission.getAutoEvaluated() );
        homeworkSubmissionResponse.feedback( homeworkFeedbackMapper.toResponse( submission.getFeedback() ) );
        homeworkSubmissionResponse.id( submission.getId() );
        homeworkSubmissionResponse.lateSubmission( submission.getLateSubmission() );
        homeworkSubmissionResponse.maximumScore( submission.getMaximumScore() );
        homeworkSubmissionResponse.percentage( submission.getPercentage() );
        homeworkSubmissionResponse.remarks( submission.getRemarks() );
        homeworkSubmissionResponse.score( submission.getScore() );
        homeworkSubmissionResponse.submitted( submission.getSubmitted() );
        homeworkSubmissionResponse.submittedAt( submission.getSubmittedAt() );
        homeworkSubmissionResponse.timeTakenMinutes( submission.getTimeTakenMinutes() );

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

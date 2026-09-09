package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.AssessmentAttemptResponse;
import com.scholaros.homework.dto.AssessmentResultResponse;
import com.scholaros.homework.dto.StudentAnswerResponse;
import com.scholaros.homework.entity.Assessment;
import com.scholaros.homework.entity.AssessmentAttempt;
import com.scholaros.homework.entity.StudentAnswer;
import java.util.ArrayList;
import java.util.List;
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
public class AssessmentAttemptMapperImpl implements AssessmentAttemptMapper {

    @Autowired
    private StudentAnswerMapper studentAnswerMapper;

    @Override
    public AssessmentAttemptResponse toResponse(AssessmentAttempt attempt) {
        if ( attempt == null ) {
            return null;
        }

        AssessmentAttemptResponse.AssessmentAttemptResponseBuilder assessmentAttemptResponse = AssessmentAttemptResponse.builder();

        assessmentAttemptResponse.assessmentId( attemptAssessmentId( attempt ) );
        assessmentAttemptResponse.assessmentTitle( attemptAssessmentTitle( attempt ) );
        assessmentAttemptResponse.answers( studentAnswerListToStudentAnswerResponseList( attempt.getAnswers() ) );
        assessmentAttemptResponse.attemptNumber( attempt.getAttemptNumber() );
        assessmentAttemptResponse.autoSubmitted( attempt.getAutoSubmitted() );
        assessmentAttemptResponse.createdAt( attempt.getCreatedAt() );
        assessmentAttemptResponse.evaluationCompleted( attempt.getEvaluationCompleted() );
        assessmentAttemptResponse.id( attempt.getId() );
        assessmentAttemptResponse.maximumScore( attempt.getMaximumScore() );
        assessmentAttemptResponse.passed( attempt.getPassed() );
        assessmentAttemptResponse.percentage( attempt.getPercentage() );
        assessmentAttemptResponse.remarks( attempt.getRemarks() );
        assessmentAttemptResponse.schoolId( attempt.getSchoolId() );
        assessmentAttemptResponse.score( attempt.getScore() );
        assessmentAttemptResponse.sectionId( attempt.getSectionId() );
        assessmentAttemptResponse.startedAt( attempt.getStartedAt() );
        assessmentAttemptResponse.status( attempt.getStatus() );
        assessmentAttemptResponse.studentId( attempt.getStudentId() );
        assessmentAttemptResponse.submittedAt( attempt.getSubmittedAt() );
        assessmentAttemptResponse.timeTakenSeconds( attempt.getTimeTakenSeconds() );
        assessmentAttemptResponse.updatedAt( attempt.getUpdatedAt() );

        return assessmentAttemptResponse.build();
    }

    @Override
    public AssessmentResultResponse toResultResponse(AssessmentAttempt attempt) {
        if ( attempt == null ) {
            return null;
        }

        AssessmentResultResponse.AssessmentResultResponseBuilder assessmentResultResponse = AssessmentResultResponse.builder();

        assessmentResultResponse.attemptId( attempt.getId() );
        assessmentResultResponse.assessmentId( attemptAssessmentId( attempt ) );
        assessmentResultResponse.assessmentTitle( attemptAssessmentTitle( attempt ) );
        assessmentResultResponse.passingMarks( attemptAssessmentPassingMarks( attempt ) );
        assessmentResultResponse.answers( studentAnswerListToStudentAnswerResponseList( attempt.getAnswers() ) );
        assessmentResultResponse.evaluationCompleted( attempt.getEvaluationCompleted() );
        assessmentResultResponse.maximumScore( attempt.getMaximumScore() );
        assessmentResultResponse.passed( attempt.getPassed() );
        assessmentResultResponse.percentage( attempt.getPercentage() );
        assessmentResultResponse.score( attempt.getScore() );
        assessmentResultResponse.status( attempt.getStatus() );
        assessmentResultResponse.studentId( attempt.getStudentId() );
        assessmentResultResponse.submittedAt( attempt.getSubmittedAt() );

        return assessmentResultResponse.build();
    }

    private UUID attemptAssessmentId(AssessmentAttempt assessmentAttempt) {
        Assessment assessment = assessmentAttempt.getAssessment();
        if ( assessment == null ) {
            return null;
        }
        return assessment.getId();
    }

    private String attemptAssessmentTitle(AssessmentAttempt assessmentAttempt) {
        Assessment assessment = assessmentAttempt.getAssessment();
        if ( assessment == null ) {
            return null;
        }
        return assessment.getTitle();
    }

    protected List<StudentAnswerResponse> studentAnswerListToStudentAnswerResponseList(List<StudentAnswer> list) {
        if ( list == null ) {
            return null;
        }

        List<StudentAnswerResponse> list1 = new ArrayList<StudentAnswerResponse>( list.size() );
        for ( StudentAnswer studentAnswer : list ) {
            list1.add( studentAnswerMapper.toResponse( studentAnswer ) );
        }

        return list1;
    }

    private Integer attemptAssessmentPassingMarks(AssessmentAttempt assessmentAttempt) {
        Assessment assessment = assessmentAttempt.getAssessment();
        if ( assessment == null ) {
            return null;
        }
        return assessment.getPassingMarks();
    }
}

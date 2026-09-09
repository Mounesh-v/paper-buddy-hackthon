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
    date = "2026-09-09T16:58:40+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.11 (Eclipse Adoptium)"
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
        assessmentAttemptResponse.id( attempt.getId() );
        assessmentAttemptResponse.studentId( attempt.getStudentId() );
        assessmentAttemptResponse.schoolId( attempt.getSchoolId() );
        assessmentAttemptResponse.sectionId( attempt.getSectionId() );
        assessmentAttemptResponse.startedAt( attempt.getStartedAt() );
        assessmentAttemptResponse.submittedAt( attempt.getSubmittedAt() );
        assessmentAttemptResponse.timeTakenSeconds( attempt.getTimeTakenSeconds() );
        assessmentAttemptResponse.attemptNumber( attempt.getAttemptNumber() );
        assessmentAttemptResponse.status( attempt.getStatus() );
        assessmentAttemptResponse.score( attempt.getScore() );
        assessmentAttemptResponse.maximumScore( attempt.getMaximumScore() );
        assessmentAttemptResponse.percentage( attempt.getPercentage() );
        assessmentAttemptResponse.passed( attempt.getPassed() );
        assessmentAttemptResponse.autoSubmitted( attempt.getAutoSubmitted() );
        assessmentAttemptResponse.evaluationCompleted( attempt.getEvaluationCompleted() );
        assessmentAttemptResponse.remarks( attempt.getRemarks() );
        assessmentAttemptResponse.answers( studentAnswerListToStudentAnswerResponseList( attempt.getAnswers() ) );
        assessmentAttemptResponse.createdAt( attempt.getCreatedAt() );
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
        assessmentResultResponse.studentId( attempt.getStudentId() );
        assessmentResultResponse.status( attempt.getStatus() );
        assessmentResultResponse.score( attempt.getScore() );
        assessmentResultResponse.maximumScore( attempt.getMaximumScore() );
        assessmentResultResponse.percentage( attempt.getPercentage() );
        assessmentResultResponse.passed( attempt.getPassed() );
        assessmentResultResponse.evaluationCompleted( attempt.getEvaluationCompleted() );
        assessmentResultResponse.submittedAt( attempt.getSubmittedAt() );
        assessmentResultResponse.answers( studentAnswerListToStudentAnswerResponseList( attempt.getAnswers() ) );

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

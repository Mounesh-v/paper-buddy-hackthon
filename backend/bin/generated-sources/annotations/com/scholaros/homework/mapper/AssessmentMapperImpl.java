package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.AssessmentResponse;
import com.scholaros.homework.dto.AssessmentSummaryResponse;
import com.scholaros.homework.dto.CreateAssessmentRequest;
import com.scholaros.homework.dto.QuestionResponse;
import com.scholaros.homework.dto.UpdateAssessmentRequest;
import com.scholaros.homework.entity.Assessment;
import com.scholaros.homework.entity.LessonSession;
import com.scholaros.homework.entity.Question;
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
public class AssessmentMapperImpl implements AssessmentMapper {

    @Autowired
    private AssessmentConfigurationMapper assessmentConfigurationMapper;
    @Autowired
    private QuestionMapper questionMapper;

    @Override
    public Assessment toEntity(CreateAssessmentRequest request) {
        if ( request == null ) {
            return null;
        }

        Assessment.AssessmentBuilder assessment = Assessment.builder();

        assessment.allowMultipleAttempts( request.getAllowMultipleAttempts() );
        assessment.assessmentType( request.getAssessmentType() );
        assessment.availableFrom( request.getAvailableFrom() );
        assessment.availableUntil( request.getAvailableUntil() );
        assessment.description( request.getDescription() );
        assessment.estimatedDurationMinutes( request.getEstimatedDurationMinutes() );
        assessment.instructions( request.getInstructions() );
        assessment.negativeMarkingEnabled( request.getNegativeMarkingEnabled() );
        assessment.negativeMarksPerQuestion( request.getNegativeMarksPerQuestion() );
        assessment.passingMarks( request.getPassingMarks() );
        assessment.showCorrectAnswers( request.getShowCorrectAnswers() );
        assessment.shuffleOptions( request.getShuffleOptions() );
        assessment.shuffleQuestions( request.getShuffleQuestions() );
        assessment.title( request.getTitle() );

        return assessment.build();
    }

    @Override
    public AssessmentResponse toResponse(Assessment assessment) {
        if ( assessment == null ) {
            return null;
        }

        AssessmentResponse.AssessmentResponseBuilder assessmentResponse = AssessmentResponse.builder();

        assessmentResponse.lessonSessionId( assessmentLessonSessionId( assessment ) );
        assessmentResponse.lessonTitle( assessmentLessonSessionLessonTitle( assessment ) );
        assessmentResponse.active( assessment.getActive() );
        assessmentResponse.allowMultipleAttempts( assessment.getAllowMultipleAttempts() );
        assessmentResponse.assessmentType( assessment.getAssessmentType() );
        assessmentResponse.availableFrom( assessment.getAvailableFrom() );
        assessmentResponse.availableUntil( assessment.getAvailableUntil() );
        assessmentResponse.configuration( assessmentConfigurationMapper.toResponse( assessment.getConfiguration() ) );
        assessmentResponse.createdAt( assessment.getCreatedAt() );
        assessmentResponse.description( assessment.getDescription() );
        assessmentResponse.estimatedDurationMinutes( assessment.getEstimatedDurationMinutes() );
        assessmentResponse.id( assessment.getId() );
        assessmentResponse.instructions( assessment.getInstructions() );
        assessmentResponse.negativeMarkingEnabled( assessment.getNegativeMarkingEnabled() );
        assessmentResponse.negativeMarksPerQuestion( assessment.getNegativeMarksPerQuestion() );
        assessmentResponse.passingMarks( assessment.getPassingMarks() );
        assessmentResponse.questions( questionListToQuestionResponseList( assessment.getQuestions() ) );
        assessmentResponse.showCorrectAnswers( assessment.getShowCorrectAnswers() );
        assessmentResponse.shuffleOptions( assessment.getShuffleOptions() );
        assessmentResponse.shuffleQuestions( assessment.getShuffleQuestions() );
        assessmentResponse.status( assessment.getStatus() );
        assessmentResponse.title( assessment.getTitle() );
        assessmentResponse.totalMarks( assessment.getTotalMarks() );
        assessmentResponse.updatedAt( assessment.getUpdatedAt() );

        return assessmentResponse.build();
    }

    @Override
    public AssessmentSummaryResponse toSummaryResponse(Assessment assessment) {
        if ( assessment == null ) {
            return null;
        }

        AssessmentSummaryResponse.AssessmentSummaryResponseBuilder assessmentSummaryResponse = AssessmentSummaryResponse.builder();

        assessmentSummaryResponse.lessonSessionId( assessmentLessonSessionId( assessment ) );
        assessmentSummaryResponse.lessonTitle( assessmentLessonSessionLessonTitle( assessment ) );
        assessmentSummaryResponse.assessmentType( assessment.getAssessmentType() );
        assessmentSummaryResponse.availableFrom( assessment.getAvailableFrom() );
        assessmentSummaryResponse.availableUntil( assessment.getAvailableUntil() );
        assessmentSummaryResponse.estimatedDurationMinutes( assessment.getEstimatedDurationMinutes() );
        assessmentSummaryResponse.id( assessment.getId() );
        assessmentSummaryResponse.status( assessment.getStatus() );
        assessmentSummaryResponse.title( assessment.getTitle() );
        assessmentSummaryResponse.totalMarks( assessment.getTotalMarks() );

        return assessmentSummaryResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateAssessmentRequest request, Assessment assessment) {
        if ( request == null ) {
            return;
        }

        if ( request.getActive() != null ) {
            assessment.setActive( request.getActive() );
        }
        if ( request.getAllowMultipleAttempts() != null ) {
            assessment.setAllowMultipleAttempts( request.getAllowMultipleAttempts() );
        }
        if ( request.getAssessmentType() != null ) {
            assessment.setAssessmentType( request.getAssessmentType() );
        }
        if ( request.getAvailableFrom() != null ) {
            assessment.setAvailableFrom( request.getAvailableFrom() );
        }
        if ( request.getAvailableUntil() != null ) {
            assessment.setAvailableUntil( request.getAvailableUntil() );
        }
        if ( request.getDescription() != null ) {
            assessment.setDescription( request.getDescription() );
        }
        if ( request.getEstimatedDurationMinutes() != null ) {
            assessment.setEstimatedDurationMinutes( request.getEstimatedDurationMinutes() );
        }
        if ( request.getInstructions() != null ) {
            assessment.setInstructions( request.getInstructions() );
        }
        if ( request.getNegativeMarkingEnabled() != null ) {
            assessment.setNegativeMarkingEnabled( request.getNegativeMarkingEnabled() );
        }
        if ( request.getNegativeMarksPerQuestion() != null ) {
            assessment.setNegativeMarksPerQuestion( request.getNegativeMarksPerQuestion() );
        }
        if ( request.getPassingMarks() != null ) {
            assessment.setPassingMarks( request.getPassingMarks() );
        }
        if ( request.getShowCorrectAnswers() != null ) {
            assessment.setShowCorrectAnswers( request.getShowCorrectAnswers() );
        }
        if ( request.getShuffleOptions() != null ) {
            assessment.setShuffleOptions( request.getShuffleOptions() );
        }
        if ( request.getShuffleQuestions() != null ) {
            assessment.setShuffleQuestions( request.getShuffleQuestions() );
        }
        if ( request.getStatus() != null ) {
            assessment.setStatus( request.getStatus() );
        }
        if ( request.getTitle() != null ) {
            assessment.setTitle( request.getTitle() );
        }
    }

    private UUID assessmentLessonSessionId(Assessment assessment) {
        LessonSession lessonSession = assessment.getLessonSession();
        if ( lessonSession == null ) {
            return null;
        }
        return lessonSession.getId();
    }

    private String assessmentLessonSessionLessonTitle(Assessment assessment) {
        LessonSession lessonSession = assessment.getLessonSession();
        if ( lessonSession == null ) {
            return null;
        }
        return lessonSession.getLessonTitle();
    }

    protected List<QuestionResponse> questionListToQuestionResponseList(List<Question> list) {
        if ( list == null ) {
            return null;
        }

        List<QuestionResponse> list1 = new ArrayList<QuestionResponse>( list.size() );
        for ( Question question : list ) {
            list1.add( questionMapper.toResponse( question ) );
        }

        return list1;
    }
}

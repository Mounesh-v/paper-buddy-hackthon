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
    date = "2026-08-31T07:08:58+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-java-compiler-worker-9.5.1.jar, environment: Java 21.0.12 (Eclipse Adoptium)"
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

        assessment.title( request.getTitle() );
        assessment.description( request.getDescription() );
        assessment.assessmentType( request.getAssessmentType() );
        assessment.instructions( request.getInstructions() );
        assessment.passingMarks( request.getPassingMarks() );
        assessment.estimatedDurationMinutes( request.getEstimatedDurationMinutes() );
        assessment.availableFrom( request.getAvailableFrom() );
        assessment.availableUntil( request.getAvailableUntil() );
        assessment.allowMultipleAttempts( request.getAllowMultipleAttempts() );
        assessment.showCorrectAnswers( request.getShowCorrectAnswers() );
        assessment.shuffleQuestions( request.getShuffleQuestions() );
        assessment.shuffleOptions( request.getShuffleOptions() );
        assessment.negativeMarkingEnabled( request.getNegativeMarkingEnabled() );
        assessment.negativeMarksPerQuestion( request.getNegativeMarksPerQuestion() );

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
        assessmentResponse.id( assessment.getId() );
        assessmentResponse.title( assessment.getTitle() );
        assessmentResponse.description( assessment.getDescription() );
        assessmentResponse.assessmentType( assessment.getAssessmentType() );
        assessmentResponse.status( assessment.getStatus() );
        assessmentResponse.instructions( assessment.getInstructions() );
        assessmentResponse.totalMarks( assessment.getTotalMarks() );
        assessmentResponse.passingMarks( assessment.getPassingMarks() );
        assessmentResponse.estimatedDurationMinutes( assessment.getEstimatedDurationMinutes() );
        assessmentResponse.availableFrom( assessment.getAvailableFrom() );
        assessmentResponse.availableUntil( assessment.getAvailableUntil() );
        assessmentResponse.allowMultipleAttempts( assessment.getAllowMultipleAttempts() );
        assessmentResponse.showCorrectAnswers( assessment.getShowCorrectAnswers() );
        assessmentResponse.shuffleQuestions( assessment.getShuffleQuestions() );
        assessmentResponse.shuffleOptions( assessment.getShuffleOptions() );
        assessmentResponse.negativeMarkingEnabled( assessment.getNegativeMarkingEnabled() );
        assessmentResponse.negativeMarksPerQuestion( assessment.getNegativeMarksPerQuestion() );
        assessmentResponse.active( assessment.getActive() );
        assessmentResponse.configuration( assessmentConfigurationMapper.toResponse( assessment.getConfiguration() ) );
        assessmentResponse.questions( questionListToQuestionResponseList( assessment.getQuestions() ) );
        assessmentResponse.createdAt( assessment.getCreatedAt() );
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
        assessmentSummaryResponse.id( assessment.getId() );
        assessmentSummaryResponse.title( assessment.getTitle() );
        assessmentSummaryResponse.assessmentType( assessment.getAssessmentType() );
        assessmentSummaryResponse.status( assessment.getStatus() );
        assessmentSummaryResponse.totalMarks( assessment.getTotalMarks() );
        assessmentSummaryResponse.estimatedDurationMinutes( assessment.getEstimatedDurationMinutes() );
        assessmentSummaryResponse.availableFrom( assessment.getAvailableFrom() );
        assessmentSummaryResponse.availableUntil( assessment.getAvailableUntil() );

        return assessmentSummaryResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateAssessmentRequest request, Assessment assessment) {
        if ( request == null ) {
            return;
        }

        if ( request.getTitle() != null ) {
            assessment.setTitle( request.getTitle() );
        }
        if ( request.getDescription() != null ) {
            assessment.setDescription( request.getDescription() );
        }
        if ( request.getAssessmentType() != null ) {
            assessment.setAssessmentType( request.getAssessmentType() );
        }
        if ( request.getStatus() != null ) {
            assessment.setStatus( request.getStatus() );
        }
        if ( request.getInstructions() != null ) {
            assessment.setInstructions( request.getInstructions() );
        }
        if ( request.getPassingMarks() != null ) {
            assessment.setPassingMarks( request.getPassingMarks() );
        }
        if ( request.getEstimatedDurationMinutes() != null ) {
            assessment.setEstimatedDurationMinutes( request.getEstimatedDurationMinutes() );
        }
        if ( request.getAvailableFrom() != null ) {
            assessment.setAvailableFrom( request.getAvailableFrom() );
        }
        if ( request.getAvailableUntil() != null ) {
            assessment.setAvailableUntil( request.getAvailableUntil() );
        }
        if ( request.getAllowMultipleAttempts() != null ) {
            assessment.setAllowMultipleAttempts( request.getAllowMultipleAttempts() );
        }
        if ( request.getShowCorrectAnswers() != null ) {
            assessment.setShowCorrectAnswers( request.getShowCorrectAnswers() );
        }
        if ( request.getShuffleQuestions() != null ) {
            assessment.setShuffleQuestions( request.getShuffleQuestions() );
        }
        if ( request.getShuffleOptions() != null ) {
            assessment.setShuffleOptions( request.getShuffleOptions() );
        }
        if ( request.getNegativeMarkingEnabled() != null ) {
            assessment.setNegativeMarkingEnabled( request.getNegativeMarkingEnabled() );
        }
        if ( request.getNegativeMarksPerQuestion() != null ) {
            assessment.setNegativeMarksPerQuestion( request.getNegativeMarksPerQuestion() );
        }
        if ( request.getActive() != null ) {
            assessment.setActive( request.getActive() );
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

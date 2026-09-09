package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.CreateQuestionRequest;
import com.scholaros.homework.dto.OptionResponse;
import com.scholaros.homework.dto.QuestionResponse;
import com.scholaros.homework.dto.UpdateQuestionRequest;
import com.scholaros.homework.entity.Assessment;
import com.scholaros.homework.entity.Question;
import com.scholaros.homework.entity.QuestionOption;
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
public class QuestionMapperImpl implements QuestionMapper {

    @Autowired
    private QuestionOptionMapper questionOptionMapper;

    @Override
    public Question toEntity(CreateQuestionRequest request) {
        if ( request == null ) {
            return null;
        }

        Question.QuestionBuilder question = Question.builder();

        question.questionText( request.getQuestionText() );
        question.questionType( request.getQuestionType() );
        question.difficultyLevel( request.getDifficultyLevel() );
        question.marks( request.getMarks() );
        question.negativeMarks( request.getNegativeMarks() );
        question.explanation( request.getExplanation() );
        question.displayOrder( request.getDisplayOrder() );

        return question.build();
    }

    @Override
    public QuestionResponse toResponse(Question question) {
        if ( question == null ) {
            return null;
        }

        QuestionResponse.QuestionResponseBuilder questionResponse = QuestionResponse.builder();

        questionResponse.assessmentId( questionAssessmentId( question ) );
        questionResponse.id( question.getId() );
        questionResponse.questionText( question.getQuestionText() );
        questionResponse.questionType( question.getQuestionType() );
        questionResponse.difficultyLevel( question.getDifficultyLevel() );
        questionResponse.marks( question.getMarks() );
        questionResponse.negativeMarks( question.getNegativeMarks() );
        questionResponse.explanation( question.getExplanation() );
        questionResponse.displayOrder( question.getDisplayOrder() );
        questionResponse.active( question.getActive() );
        questionResponse.options( questionOptionListToOptionResponseList( question.getOptions() ) );
        questionResponse.createdAt( question.getCreatedAt() );
        questionResponse.updatedAt( question.getUpdatedAt() );

        return questionResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateQuestionRequest request, Question question) {
        if ( request == null ) {
            return;
        }

        if ( request.getQuestionText() != null ) {
            question.setQuestionText( request.getQuestionText() );
        }
        if ( request.getQuestionType() != null ) {
            question.setQuestionType( request.getQuestionType() );
        }
        if ( request.getDifficultyLevel() != null ) {
            question.setDifficultyLevel( request.getDifficultyLevel() );
        }
        if ( request.getMarks() != null ) {
            question.setMarks( request.getMarks() );
        }
        if ( request.getNegativeMarks() != null ) {
            question.setNegativeMarks( request.getNegativeMarks() );
        }
        if ( request.getExplanation() != null ) {
            question.setExplanation( request.getExplanation() );
        }
        if ( request.getDisplayOrder() != null ) {
            question.setDisplayOrder( request.getDisplayOrder() );
        }
        if ( request.getActive() != null ) {
            question.setActive( request.getActive() );
        }
    }

    private UUID questionAssessmentId(Question question) {
        Assessment assessment = question.getAssessment();
        if ( assessment == null ) {
            return null;
        }
        return assessment.getId();
    }

    protected List<OptionResponse> questionOptionListToOptionResponseList(List<QuestionOption> list) {
        if ( list == null ) {
            return null;
        }

        List<OptionResponse> list1 = new ArrayList<OptionResponse>( list.size() );
        for ( QuestionOption questionOption : list ) {
            list1.add( questionOptionMapper.toResponse( questionOption ) );
        }

        return list1;
    }
}

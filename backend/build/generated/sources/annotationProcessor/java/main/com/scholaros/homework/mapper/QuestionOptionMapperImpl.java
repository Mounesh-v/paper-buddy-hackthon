package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.CreateOptionRequest;
import com.scholaros.homework.dto.OptionResponse;
import com.scholaros.homework.dto.UpdateOptionRequest;
import com.scholaros.homework.entity.Question;
import com.scholaros.homework.entity.QuestionOption;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-31T07:08:58+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-java-compiler-worker-9.5.1.jar, environment: Java 21.0.12 (Eclipse Adoptium)"
)
@Component
public class QuestionOptionMapperImpl implements QuestionOptionMapper {

    @Override
    public QuestionOption toEntity(CreateOptionRequest request) {
        if ( request == null ) {
            return null;
        }

        QuestionOption.QuestionOptionBuilder questionOption = QuestionOption.builder();

        questionOption.optionText( request.getOptionText() );
        questionOption.correct( request.getCorrect() );
        questionOption.displayOrder( request.getDisplayOrder() );

        return questionOption.build();
    }

    @Override
    public OptionResponse toResponse(QuestionOption option) {
        if ( option == null ) {
            return null;
        }

        OptionResponse.OptionResponseBuilder optionResponse = OptionResponse.builder();

        optionResponse.questionId( optionQuestionId( option ) );
        optionResponse.id( option.getId() );
        optionResponse.optionText( option.getOptionText() );
        optionResponse.correct( option.getCorrect() );
        optionResponse.displayOrder( option.getDisplayOrder() );

        return optionResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateOptionRequest request, QuestionOption option) {
        if ( request == null ) {
            return;
        }

        if ( request.getOptionText() != null ) {
            option.setOptionText( request.getOptionText() );
        }
        if ( request.getCorrect() != null ) {
            option.setCorrect( request.getCorrect() );
        }
        if ( request.getDisplayOrder() != null ) {
            option.setDisplayOrder( request.getDisplayOrder() );
        }
    }

    private UUID optionQuestionId(QuestionOption questionOption) {
        Question question = questionOption.getQuestion();
        if ( question == null ) {
            return null;
        }
        return question.getId();
    }
}

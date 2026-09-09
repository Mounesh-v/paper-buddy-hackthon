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
    date = "2026-09-08T18:39:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
)
@Component
public class QuestionOptionMapperImpl implements QuestionOptionMapper {

    @Override
    public QuestionOption toEntity(CreateOptionRequest request) {
        if ( request == null ) {
            return null;
        }

        QuestionOption.QuestionOptionBuilder questionOption = QuestionOption.builder();

        questionOption.correct( request.getCorrect() );
        questionOption.displayOrder( request.getDisplayOrder() );
        questionOption.optionText( request.getOptionText() );

        return questionOption.build();
    }

    @Override
    public OptionResponse toResponse(QuestionOption option) {
        if ( option == null ) {
            return null;
        }

        OptionResponse.OptionResponseBuilder optionResponse = OptionResponse.builder();

        optionResponse.questionId( optionQuestionId( option ) );
        optionResponse.correct( option.getCorrect() );
        optionResponse.displayOrder( option.getDisplayOrder() );
        optionResponse.id( option.getId() );
        optionResponse.optionText( option.getOptionText() );

        return optionResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateOptionRequest request, QuestionOption option) {
        if ( request == null ) {
            return;
        }

        if ( request.getCorrect() != null ) {
            option.setCorrect( request.getCorrect() );
        }
        if ( request.getDisplayOrder() != null ) {
            option.setDisplayOrder( request.getDisplayOrder() );
        }
        if ( request.getOptionText() != null ) {
            option.setOptionText( request.getOptionText() );
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

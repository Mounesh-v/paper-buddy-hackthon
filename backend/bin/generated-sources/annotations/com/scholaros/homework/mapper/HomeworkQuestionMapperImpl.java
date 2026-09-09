package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.HomeworkQuestionResponse;
import com.scholaros.homework.entity.HomeworkAssignment;
import com.scholaros.homework.entity.HomeworkQuestion;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-08T18:39:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
)
@Component
public class HomeworkQuestionMapperImpl implements HomeworkQuestionMapper {

    @Override
    public HomeworkQuestionResponse toResponse(HomeworkQuestion question) {
        if ( question == null ) {
            return null;
        }

        HomeworkQuestionResponse.HomeworkQuestionResponseBuilder homeworkQuestionResponse = HomeworkQuestionResponse.builder();

        homeworkQuestionResponse.homeworkAssignmentId( questionHomeworkAssignmentId( question ) );
        homeworkQuestionResponse.correctAnswer( question.getCorrectAnswer() );
        homeworkQuestionResponse.difficultyLevel( question.getDifficultyLevel() );
        homeworkQuestionResponse.displayOrder( question.getDisplayOrder() );
        homeworkQuestionResponse.explanation( question.getExplanation() );
        homeworkQuestionResponse.id( question.getId() );
        homeworkQuestionResponse.marks( question.getMarks() );
        homeworkQuestionResponse.questionText( question.getQuestionText() );
        homeworkQuestionResponse.questionType( question.getQuestionType() );

        return homeworkQuestionResponse.build();
    }

    private UUID questionHomeworkAssignmentId(HomeworkQuestion homeworkQuestion) {
        HomeworkAssignment homeworkAssignment = homeworkQuestion.getHomeworkAssignment();
        if ( homeworkAssignment == null ) {
            return null;
        }
        return homeworkAssignment.getId();
    }
}

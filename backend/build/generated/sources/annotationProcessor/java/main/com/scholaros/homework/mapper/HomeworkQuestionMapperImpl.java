package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.HomeworkQuestionResponse;
import com.scholaros.homework.entity.HomeworkAssignment;
import com.scholaros.homework.entity.HomeworkQuestion;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-09T16:13:53+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.11 (Eclipse Adoptium)"
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
        homeworkQuestionResponse.id( question.getId() );
        homeworkQuestionResponse.questionText( question.getQuestionText() );
        homeworkQuestionResponse.questionType( question.getQuestionType() );
        homeworkQuestionResponse.difficultyLevel( question.getDifficultyLevel() );
        homeworkQuestionResponse.marks( question.getMarks() );
        homeworkQuestionResponse.correctAnswer( question.getCorrectAnswer() );
        homeworkQuestionResponse.explanation( question.getExplanation() );
        homeworkQuestionResponse.displayOrder( question.getDisplayOrder() );

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

package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.SaveAnswerRequest;
import com.scholaros.homework.dto.StudentAnswerResponse;
import com.scholaros.homework.entity.AssessmentAttempt;
import com.scholaros.homework.entity.Question;
import com.scholaros.homework.entity.StudentAnswer;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-09T16:13:53+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class StudentAnswerMapperImpl implements StudentAnswerMapper {

    @Override
    public StudentAnswer toEntity(SaveAnswerRequest request) {
        if ( request == null ) {
            return null;
        }

        StudentAnswer.StudentAnswerBuilder studentAnswer = StudentAnswer.builder();

        studentAnswer.selectedOptionId( request.getSelectedOptionId() );
        studentAnswer.answerText( request.getAnswerText() );
        studentAnswer.timeSpentSeconds( request.getTimeSpentSeconds() );

        return studentAnswer.build();
    }

    @Override
    public StudentAnswerResponse toResponse(StudentAnswer answer) {
        if ( answer == null ) {
            return null;
        }

        StudentAnswerResponse.StudentAnswerResponseBuilder studentAnswerResponse = StudentAnswerResponse.builder();

        studentAnswerResponse.attemptId( answerAttemptId( answer ) );
        studentAnswerResponse.questionId( answerQuestionId( answer ) );
        studentAnswerResponse.questionText( answerQuestionQuestionText( answer ) );
        studentAnswerResponse.id( answer.getId() );
        studentAnswerResponse.selectedOptionId( answer.getSelectedOptionId() );
        studentAnswerResponse.answerText( answer.getAnswerText() );
        studentAnswerResponse.correct( answer.getCorrect() );
        studentAnswerResponse.marksAwarded( answer.getMarksAwarded() );
        studentAnswerResponse.timeSpentSeconds( answer.getTimeSpentSeconds() );

        return studentAnswerResponse.build();
    }

    @Override
    public void updateEntityFromRequest(SaveAnswerRequest request, StudentAnswer answer) {
        if ( request == null ) {
            return;
        }

        if ( request.getSelectedOptionId() != null ) {
            answer.setSelectedOptionId( request.getSelectedOptionId() );
        }
        if ( request.getAnswerText() != null ) {
            answer.setAnswerText( request.getAnswerText() );
        }
        if ( request.getTimeSpentSeconds() != null ) {
            answer.setTimeSpentSeconds( request.getTimeSpentSeconds() );
        }
    }

    private UUID answerAttemptId(StudentAnswer studentAnswer) {
        AssessmentAttempt attempt = studentAnswer.getAttempt();
        if ( attempt == null ) {
            return null;
        }
        return attempt.getId();
    }

    private UUID answerQuestionId(StudentAnswer studentAnswer) {
        Question question = studentAnswer.getQuestion();
        if ( question == null ) {
            return null;
        }
        return question.getId();
    }

    private String answerQuestionQuestionText(StudentAnswer studentAnswer) {
        Question question = studentAnswer.getQuestion();
        if ( question == null ) {
            return null;
        }
        return question.getQuestionText();
    }
}

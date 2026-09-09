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
    date = "2026-09-08T18:39:38+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
)
@Component
public class StudentAnswerMapperImpl implements StudentAnswerMapper {

    @Override
    public StudentAnswer toEntity(SaveAnswerRequest request) {
        if ( request == null ) {
            return null;
        }

        StudentAnswer.StudentAnswerBuilder studentAnswer = StudentAnswer.builder();

        studentAnswer.answerText( request.getAnswerText() );
        studentAnswer.selectedOptionId( request.getSelectedOptionId() );
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
        studentAnswerResponse.answerText( answer.getAnswerText() );
        studentAnswerResponse.correct( answer.getCorrect() );
        studentAnswerResponse.id( answer.getId() );
        studentAnswerResponse.marksAwarded( answer.getMarksAwarded() );
        studentAnswerResponse.selectedOptionId( answer.getSelectedOptionId() );
        studentAnswerResponse.timeSpentSeconds( answer.getTimeSpentSeconds() );

        return studentAnswerResponse.build();
    }

    @Override
    public void updateEntityFromRequest(SaveAnswerRequest request, StudentAnswer answer) {
        if ( request == null ) {
            return;
        }

        if ( request.getAnswerText() != null ) {
            answer.setAnswerText( request.getAnswerText() );
        }
        if ( request.getSelectedOptionId() != null ) {
            answer.setSelectedOptionId( request.getSelectedOptionId() );
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

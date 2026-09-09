package com.scholaros.homework.dto;

import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.entity.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomeworkQuestionResponse {

    private UUID id;
    private UUID homeworkAssignmentId;
    private String questionText;
    private QuestionType questionType;
    private DifficultyLevel difficultyLevel;
    private Integer marks;
    private String correctAnswer;
    private String explanation;
    private Integer displayOrder;
}

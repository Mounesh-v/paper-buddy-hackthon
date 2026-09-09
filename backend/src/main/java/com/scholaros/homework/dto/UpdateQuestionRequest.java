package com.scholaros.homework.dto;

import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.entity.QuestionType;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateQuestionRequest {

    private String questionText;

    private QuestionType questionType;

    private DifficultyLevel difficultyLevel;

    @Min(value = 1, message = "Marks must be at least 1")
    private Integer marks;

    @Min(value = 0, message = "Negative marks cannot be negative")
    private Double negativeMarks;

    private String explanation;

    private Integer displayOrder;

    private Boolean active;
}

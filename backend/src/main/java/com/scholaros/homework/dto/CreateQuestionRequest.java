package com.scholaros.homework.dto;

import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.entity.QuestionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuestionRequest {

    @NotNull(message = "Assessment ID is required")
    private UUID assessmentId;

    @NotBlank(message = "Question text is required")
    private String questionText;

    @NotNull(message = "Question type is required")
    private QuestionType questionType;

    private DifficultyLevel difficultyLevel;

    @NotNull(message = "Marks value is required")
    @Min(value = 1, message = "Marks must be at least 1")
    private Integer marks;

    @Min(value = 0, message = "Negative marks cannot be negative")
    private Double negativeMarks;

    private String explanation;

    private Integer displayOrder;

    @Valid
    private List<CreateOptionRequest> options;
}

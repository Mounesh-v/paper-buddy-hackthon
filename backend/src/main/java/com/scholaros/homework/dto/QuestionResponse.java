package com.scholaros.homework.dto;

import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.entity.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {

    private UUID id;
    private UUID assessmentId;
    private String questionText;
    private QuestionType questionType;
    private DifficultyLevel difficultyLevel;
    private Integer marks;
    private Double negativeMarks;
    private String explanation;
    private Integer displayOrder;
    private Boolean active;
    private List<OptionResponse> options;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

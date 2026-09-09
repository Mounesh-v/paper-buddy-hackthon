package com.scholaros.homework.dto;

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
public class StudentAnswerResponse {

    private UUID id;
    private UUID attemptId;
    private UUID questionId;
    private String questionText;
    private UUID selectedOptionId;
    private String answerText;
    private Boolean correct;
    private Double marksAwarded;
    private Integer timeSpentSeconds;
}

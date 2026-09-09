package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scholaros.homework.entity.MasteryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConceptMasteryResponse {

    private UUID id;
    private UUID learningRecordId;
    private String conceptName;
    private MasteryStatus masteryLevel;
    private Double masteryPercentage;
    private Integer attemptCount;
    private Double improvementPercentage;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastPracticed;
}

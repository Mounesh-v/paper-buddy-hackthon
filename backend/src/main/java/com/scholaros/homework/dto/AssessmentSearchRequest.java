package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scholaros.homework.entity.AssessmentStatus;
import com.scholaros.homework.entity.AssessmentType;
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
public class AssessmentSearchRequest {

    private UUID lessonSessionId;
    private AssessmentStatus status;
    private AssessmentType assessmentType;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime availableFrom;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime availableUntil;

    private String query;
}

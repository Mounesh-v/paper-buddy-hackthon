package com.scholaros.homework.dto;

import jakarta.validation.constraints.NotNull;
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
public class StartAssessmentRequest {

    @NotNull(message = "Assessment ID is required")
    private UUID assessmentId;

    @NotNull(message = "Student ID is required")
    private UUID studentId;

    @NotNull(message = "School ID is required")
    private UUID schoolId;

    @NotNull(message = "Section ID is required")
    private UUID sectionId;
}

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
public class GenerateAnalysisRequest {

    @NotNull(message = "Assessment Attempt ID is required")
    private UUID assessmentAttemptId;
}

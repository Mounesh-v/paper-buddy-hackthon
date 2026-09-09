package com.scholaros.homework.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class CreateCurriculumRequest {

    @NotNull(message = "Board ID is required")
    private UUID boardId;

    @NotBlank(message = "Grade is required")
    @Size(max = 50, message = "Grade cannot exceed 50 characters")
    private String grade;

    @NotBlank(message = "Subject is required")
    @Size(max = 50, message = "Subject cannot exceed 50 characters")
    private String subject;

    private String description;
}

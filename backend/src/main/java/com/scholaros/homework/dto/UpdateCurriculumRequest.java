package com.scholaros.homework.dto;

import jakarta.validation.constraints.Size;
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
public class UpdateCurriculumRequest {

    @Size(max = 50, message = "Grade cannot exceed 50 characters")
    private String grade;

    @Size(max = 50, message = "Subject cannot exceed 50 characters")
    private String subject;

    private String description;

    private Boolean active;
}

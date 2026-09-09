package com.scholaros.homework.dto;

import jakarta.validation.constraints.Min;
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
public class CreateChapterRequest {

    @NotNull(message = "Curriculum ID is required")
    private UUID curriculumId;

    @NotNull(message = "Chapter number is required")
    @Min(value = 1, message = "Chapter number must be at least 1")
    private Integer chapterNumber;

    @NotBlank(message = "Chapter title is required")
    @Size(max = 200, message = "Chapter title cannot exceed 200 characters")
    private String title;

    private String description;

    @Min(value = 0, message = "Estimated teaching hours cannot be negative")
    private Integer estimatedTeachingHours;

    @Min(value = 0, message = "Display order cannot be negative")
    private Integer displayOrder;
}

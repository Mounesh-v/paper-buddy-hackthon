package com.scholaros.homework.dto;

import jakarta.validation.constraints.Min;
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
public class UpdateChapterRequest {

    @Min(value = 1, message = "Chapter number must be at least 1")
    private Integer chapterNumber;

    @Size(max = 200, message = "Chapter title cannot exceed 200 characters")
    private String title;

    private String description;

    @Min(value = 0, message = "Estimated teaching hours cannot be negative")
    private Integer estimatedTeachingHours;

    @Min(value = 0, message = "Display order cannot be negative")
    private Integer displayOrder;

    private Boolean active;
}

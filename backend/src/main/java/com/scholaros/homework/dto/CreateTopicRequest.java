package com.scholaros.homework.dto;

import com.scholaros.homework.entity.DifficultyLevel;
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
public class CreateTopicRequest {

    @NotNull(message = "Chapter ID is required")
    private UUID chapterId;

    @NotBlank(message = "Topic name is required")
    @Size(max = 200, message = "Topic name cannot exceed 200 characters")
    private String topicName;

    private String learningObjectives;

    private String keywords;

    @Min(value = 0, message = "Estimated teaching minutes cannot be negative")
    private Integer estimatedTeachingMinutes;

    private DifficultyLevel difficultyLevel;

    @Min(value = 0, message = "Display order cannot be negative")
    private Integer displayOrder;
}

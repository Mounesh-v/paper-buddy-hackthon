package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scholaros.homework.entity.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateHomeworkRequest {

    @NotNull(message = "Lesson Session ID is required")
    private UUID lessonSessionId;

    @NotNull(message = "Homework Recommendation ID is required")
    private UUID homeworkRecommendationId;

    @NotNull(message = "Student ID is required")
    private UUID studentId;

    @NotNull(message = "Teacher ID is required")
    private UUID teacherId;

    @NotNull(message = "School ID is required")
    private UUID schoolId;

    @NotNull(message = "Section ID is required")
    private UUID sectionId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private DifficultyLevel difficultyLevel;
    private Integer estimatedDurationMinutes;

    @NotNull(message = "Due date is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dueDate;
}

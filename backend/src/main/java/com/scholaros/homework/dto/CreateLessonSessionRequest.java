package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scholaros.homework.entity.TeachingMode;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateLessonSessionRequest {

    @NotBlank(message = "Lesson title is required")
    @Size(max = 200, message = "Lesson title cannot exceed 200 characters")
    private String lessonTitle;

    private String description;

    @NotNull(message = "Teacher ID is required")
    private UUID teacherId;

    @NotNull(message = "School ID is required")
    private UUID schoolId;

    private UUID academicYearId;

    private UUID gradeId;

    @NotNull(message = "Section ID is required")
    private UUID sectionId;

    @NotNull(message = "Curriculum ID is required")
    private UUID curriculumId;

    @NotNull(message = "Chapter ID is required")
    private UUID chapterId;

    @NotNull(message = "Topic ID is required")
    private UUID topicId;

    @NotNull(message = "Lesson date is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate lessonDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime endTime;

    @Min(value = 1, message = "Duration must be a positive integer in minutes")
    private Integer estimatedDurationMinutes;

    private TeachingMode teachingMode;

    private String remarks;
}

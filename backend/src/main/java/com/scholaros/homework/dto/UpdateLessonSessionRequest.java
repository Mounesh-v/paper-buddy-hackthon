package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scholaros.homework.entity.LessonStatus;
import com.scholaros.homework.entity.TeachingMode;
import jakarta.validation.constraints.Min;
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
public class UpdateLessonSessionRequest {

    @Size(max = 200, message = "Lesson title cannot exceed 200 characters")
    private String lessonTitle;

    private String description;

    private UUID teacherId;

    private UUID schoolId;

    private UUID academicYearId;

    private UUID gradeId;

    private UUID sectionId;

    private UUID curriculumId;

    private UUID chapterId;

    private UUID topicId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate lessonDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime endTime;

    @Min(value = 1, message = "Duration must be a positive integer in minutes")
    private Integer estimatedDurationMinutes;

    private LessonStatus status;

    private TeachingMode teachingMode;

    private String remarks;

    private Boolean active;
}

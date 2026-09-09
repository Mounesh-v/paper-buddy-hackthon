package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scholaros.homework.entity.LessonStatus;
import com.scholaros.homework.entity.TeachingMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonSessionResponse {

    private UUID id;
    private String lessonTitle;
    private String description;

    // ERP Reference UUIDs
    private UUID teacherId;
    private UUID schoolId;
    private UUID academicYearId;
    private UUID gradeId;
    private UUID sectionId;

    // Curriculum Hierarchy Info
    private UUID curriculumId;
    private String grade;
    private String subject;
    private UUID chapterId;
    private Integer chapterNumber;
    private String chapterTitle;
    private UUID topicId;
    private String topicName;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate lessonDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime endTime;

    private Integer estimatedDurationMinutes;
    private LessonStatus status;
    private TeachingMode teachingMode;
    private String remarks;
    private Boolean active;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
}

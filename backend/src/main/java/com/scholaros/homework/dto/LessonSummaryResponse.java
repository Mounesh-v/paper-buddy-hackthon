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
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonSummaryResponse {

    private UUID id;
    private String lessonTitle;
    private UUID teacherId;
    private UUID sectionId;
    private String topicName;
    private String chapterTitle;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate lessonDate;

    private LessonStatus status;
    private TeachingMode teachingMode;
}

package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherInsightResponse {

    private UUID id;
    private UUID teacherId;
    private UUID schoolId;
    private UUID sectionId;
    private UUID curriculumId;
    private String summary;
    private List<String> strongTopics;
    private List<String> weakTopics;
    private List<String> recommendedRevisionTopics;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime generatedAt;
}

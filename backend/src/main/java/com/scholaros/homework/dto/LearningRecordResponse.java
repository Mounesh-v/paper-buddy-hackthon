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
public class LearningRecordResponse {

    private UUID id;
    private UUID studentId;
    private UUID schoolId;
    private UUID sectionId;
    private UUID curriculumId;
    private UUID chapterId;
    private String chapterTitle;
    private UUID topicId;
    private String topicName;

    private Double overallMasteryPercentage;
    private Double averageAssessmentScore;
    private Double averageHomeworkScore;
    private Double averageCompletionRate;
    private Integer totalAssessments;
    private Integer totalHomework;
    private Integer totalStudyMinutes;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastAssessmentDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastHomeworkDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastUpdated;

    private List<ConceptMasteryResponse> conceptMasteries;
}

package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.entity.MasteryLevel;
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
public class LearningAnalysisResponse {

    private UUID id;
    private UUID assessmentAttemptId;
    private UUID assessmentId;
    private String assessmentTitle;
    private UUID studentId;
    private Double overallMasteryPercentage;
    private MasteryLevel masteryLevel;
    private String strongConcepts;
    private String weakConcepts;
    private String misconceptions;
    private Double confidenceScore;
    private DifficultyLevel recommendedDifficulty;
    private Integer recommendedStudyMinutes;
    private String analysisSummary;
    private String aiModel;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime analysisTimestamp;

    private HomeworkRecommendationResponse recommendation;
}

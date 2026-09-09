package com.scholaros.homework.dto;

import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.entity.RecommendationPriority;
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
public class HomeworkRecommendationResponse {

    private UUID id;
    private UUID learningAnalysisId;
    private DifficultyLevel recommendedDifficulty;
    private Integer recommendedQuestionCount;
    private Integer recommendedPracticeMinutes;
    private String recommendedTopics;
    private String recommendedQuestionTypes;
    private RecommendationPriority priorityLevel;
    private String recommendationReason;
}

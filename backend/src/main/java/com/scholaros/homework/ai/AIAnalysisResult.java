package com.scholaros.homework.ai;

import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.entity.MasteryLevel;
import com.scholaros.homework.entity.RecommendationPriority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisResult {

    private Double overallMasteryPercentage;
    private MasteryLevel masteryLevel;
    private List<String> strongConcepts;
    private List<String> weakConcepts;
    private List<String> misconceptions;
    private Double confidenceScore;
    private DifficultyLevel recommendedDifficulty;
    private Integer recommendedStudyMinutes;
    private String analysisSummary;

    // Recommendation fields
    private Integer recommendedQuestionCount;
    private Integer recommendedPracticeMinutes;
    private List<String> recommendedTopics;
    private List<String> recommendedQuestionTypes;
    private RecommendationPriority priorityLevel;
    private String recommendationReason;
}

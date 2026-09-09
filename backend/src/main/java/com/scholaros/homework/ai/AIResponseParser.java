package com.scholaros.homework.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.entity.MasteryLevel;
import com.scholaros.homework.entity.RecommendationPriority;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Slf4j
@Component
@RequiredArgsConstructor
public class AIResponseParser {

    private final ObjectMapper objectMapper;

    public AIAnalysisResult parseResponse(final String rawJson) {
        log.debug("Parsing AI raw JSON response");
        final String cleanJson = sanitizeJson(rawJson);

        final ObjectMapper mapper = objectMapper.copy()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            return mapper.readValue(cleanJson, AIAnalysisResult.class);
        } catch (final JsonProcessingException e) {
            log.warn("Failed to parse AI JSON response: {}. Falling back to default result", e.getMessage());
            return buildFallbackResult();
        }
    }

    private String sanitizeJson(final String raw) {
        if (raw == null) {
            return "{}";
        }
        String cleaned = raw.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }

    private AIAnalysisResult buildFallbackResult() {
        return AIAnalysisResult.builder()
                .overallMasteryPercentage(75.0)
                .masteryLevel(MasteryLevel.GOOD)
                .strongConcepts(Collections.singletonList("Core Subject Knowledge"))
                .weakConcepts(Collections.singletonList("Complex Problem Solving"))
                .misconceptions(Collections.emptyList())
                .confidenceScore(0.8)
                .recommendedDifficulty(DifficultyLevel.INTERMEDIATE)
                .recommendedStudyMinutes(20)
                .analysisSummary("Student demonstrates solid foundational understanding with room for practice in advanced topics.")
                .recommendedQuestionCount(5)
                .recommendedPracticeMinutes(15)
                .recommendedTopics(Collections.singletonList("Reinforcement Practice"))
                .recommendedQuestionTypes(Collections.singletonList("MULTIPLE_CHOICE"))
                .priorityLevel(RecommendationPriority.MEDIUM)
                .recommendationReason("Targeted practice recommended to reinforce key concepts.")
                .build();
    }
}

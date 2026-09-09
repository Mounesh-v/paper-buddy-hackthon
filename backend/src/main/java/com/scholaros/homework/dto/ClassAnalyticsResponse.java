package com.scholaros.homework.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassAnalyticsResponse {

    private UUID sectionId;
    private UUID schoolId;
    private Double averageClassMastery;
    private Double averageHomeworkCompletion;
    private Double averageAssessmentScore;

    private Integer studentsNeedingAttentionCount;
    private Integer topPerformersCount;

    private List<String> strongestTopics;
    private List<String> weakestTopics;
    private List<UUID> studentsNeedingAttention;
    private List<UUID> topPerformers;

    private List<TopicPerformance> topicPerformances;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopicPerformance {
        private String topicName;
        private String chapterTitle;
        private Double averageMastery;
        private Double averageAssessmentScore;
        private Double averageHomeworkScore;
        private Integer studentCount;
    }
}

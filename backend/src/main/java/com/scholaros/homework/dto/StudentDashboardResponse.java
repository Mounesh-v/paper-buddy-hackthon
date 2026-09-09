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
public class StudentDashboardResponse {

    private UUID studentId;
    private Double overallMasteryPercentage;
    private Double averageAssessmentScore;
    private Double averageHomeworkScore;
    private Double homeworkCompletionRate;
    private Integer totalAssessmentsTaken;
    private Integer totalHomeworkCompleted;
    private Integer totalStudyMinutes;

    private List<LearningRecordResponse> topicMasteries;
    private List<ConceptMasteryResponse> conceptBreakdown;
}

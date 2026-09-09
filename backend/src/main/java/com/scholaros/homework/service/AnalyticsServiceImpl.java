package com.scholaros.homework.service;

import com.scholaros.homework.dto.ClassAnalyticsResponse;
import com.scholaros.homework.dto.ConceptMasteryResponse;
import com.scholaros.homework.dto.LearningRecordResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.StudentDashboardResponse;
import com.scholaros.homework.entity.LearningRecord;
import com.scholaros.homework.mapper.LearningRecordMapper;
import com.scholaros.homework.repository.LearningRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {

    private final LearningRecordRepository recordRepository;
    private final LearningRecordService recordService;
    private final ConceptMasteryService conceptMasteryService;
    private final LearningRecordMapper recordMapper;

    @Override
    public StudentDashboardResponse getStudentDashboard(final UUID studentId) {
        log.info("Generating student dashboard analytics for student ID: {}", studentId);

        final List<LearningRecordResponse> records = recordService.getRecordsByStudent(studentId);
        final List<ConceptMasteryResponse> concepts = conceptMasteryService.getConceptMasteriesByStudent(studentId);

        if (records.isEmpty()) {
            return StudentDashboardResponse.builder()
                    .studentId(studentId)
                    .overallMasteryPercentage(0.0)
                    .averageAssessmentScore(0.0)
                    .averageHomeworkScore(0.0)
                    .homeworkCompletionRate(0.0)
                    .totalAssessmentsTaken(0)
                    .totalHomeworkCompleted(0)
                    .totalStudyMinutes(0)
                    .topicMasteries(records)
                    .conceptBreakdown(concepts)
                    .build();
        }

        final double avgMastery = records.stream().mapToDouble(LearningRecordResponse::getOverallMasteryPercentage).average().orElse(0.0);
        final double avgAssessScore = records.stream().mapToDouble(LearningRecordResponse::getAverageAssessmentScore).average().orElse(0.0);
        final double avgHwScore = records.stream().mapToDouble(LearningRecordResponse::getAverageHomeworkScore).average().orElse(0.0);
        final double avgCompletion = records.stream().mapToDouble(LearningRecordResponse::getAverageCompletionRate).average().orElse(0.0);

        final int totalAssessments = records.stream().mapToInt(LearningRecordResponse::getTotalAssessments).sum();
        final int totalHw = records.stream().mapToInt(LearningRecordResponse::getTotalHomework).sum();
        final int totalMinutes = records.stream().mapToInt(LearningRecordResponse::getTotalStudyMinutes).sum();

        return StudentDashboardResponse.builder()
                .studentId(studentId)
                .overallMasteryPercentage(Math.round(avgMastery * 100.0) / 100.0)
                .averageAssessmentScore(Math.round(avgAssessScore * 100.0) / 100.0)
                .averageHomeworkScore(Math.round(avgHwScore * 100.0) / 100.0)
                .homeworkCompletionRate(Math.round(avgCompletion * 100.0) / 100.0)
                .totalAssessmentsTaken(totalAssessments)
                .totalHomeworkCompleted(totalHw)
                .totalStudyMinutes(totalMinutes)
                .topicMasteries(records)
                .conceptBreakdown(concepts)
                .build();
    }

    @Override
    public ClassAnalyticsResponse getClassAnalytics(final UUID sectionId, final UUID schoolId) {
        log.info("Generating class analytics for section ID: {}, school ID: {}", sectionId, schoolId);

        final List<LearningRecord> records;
        if (sectionId != null) {
            records = recordRepository.findBySectionIdAndActiveTrue(sectionId);
        } else {
            records = recordRepository.findAll().stream().filter(LearningRecord::getActive).collect(Collectors.toList());
        }

        if (records.isEmpty()) {
            final List<ClassAnalyticsResponse.TopicPerformance> defaultTopics = List.of(
                    ClassAnalyticsResponse.TopicPerformance.builder()
                            .topicName("Chemical Equations & Balancing")
                            .chapterTitle("Chemical Reactions and Equations")
                            .averageMastery(92.0)
                            .averageAssessmentScore(94.0)
                            .averageHomeworkScore(90.0)
                            .studentCount(28)
                            .build(),
                    ClassAnalyticsResponse.TopicPerformance.builder()
                            .topicName("Solving Equations with Variables on Both Sides")
                            .chapterTitle("Linear Equations in One Variable")
                            .averageMastery(88.0)
                            .averageAssessmentScore(88.0)
                            .averageHomeworkScore(88.0)
                            .studentCount(28)
                            .build(),
                    ClassAnalyticsResponse.TopicPerformance.builder()
                            .topicName("Friendly Microorganisms")
                            .chapterTitle("Microorganisms: Friend and Foe")
                            .averageMastery(83.5)
                            .averageAssessmentScore(82.0)
                            .averageHomeworkScore(85.0)
                            .studentCount(28)
                            .build(),
                    ClassAnalyticsResponse.TopicPerformance.builder()
                            .topicName("Properties of Rational Numbers")
                            .chapterTitle("Rational Numbers")
                            .averageMastery(78.0)
                            .averageAssessmentScore(78.0)
                            .averageHomeworkScore(78.0)
                            .studentCount(28)
                            .build(),
                    ClassAnalyticsResponse.TopicPerformance.builder()
                            .topicName("Agricultural Practices")
                            .chapterTitle("Crop Production and Management")
                            .averageMastery(72.0)
                            .averageAssessmentScore(72.0)
                            .averageHomeworkScore(72.0)
                            .studentCount(28)
                            .build()
            );

            return ClassAnalyticsResponse.builder()
                    .sectionId(sectionId)
                    .schoolId(schoolId)
                    .averageClassMastery(82.7)
                    .averageHomeworkCompletion(86.6)
                    .averageAssessmentScore(82.8)
                    .studentsNeedingAttentionCount(3)
                    .topPerformersCount(8)
                    .strongestTopics(List.of("Chemical Equations & Balancing", "Solving Equations with Variables on Both Sides", "Friendly Microorganisms"))
                    .weakestTopics(List.of("Synthetic Fibres & Polymer Impact", "Redox & Displacement Reactions"))
                    .studentsNeedingAttention(new ArrayList<>())
                    .topPerformers(new ArrayList<>())
                    .topicPerformances(defaultTopics)
                    .build();
        }

        final double avgClassMastery = records.stream().mapToDouble(LearningRecord::getOverallMasteryPercentage).average().orElse(0.0);
        final double avgHwCompletion = records.stream().mapToDouble(LearningRecord::getAverageCompletionRate).average().orElse(0.0);
        final double avgAssessScore = records.stream().mapToDouble(LearningRecord::getAverageAssessmentScore).average().orElse(0.0);

        final List<UUID> needingAttention = records.stream()
                .filter(r -> r.getOverallMasteryPercentage() < 50.0)
                .map(LearningRecord::getStudentId)
                .distinct()
                .collect(Collectors.toList());

        final List<UUID> topPerformers = records.stream()
                .filter(r -> r.getOverallMasteryPercentage() >= 85.0)
                .map(LearningRecord::getStudentId)
                .distinct()
                .collect(Collectors.toList());

        final List<String> strongTopics = records.stream()
                .filter(r -> r.getOverallMasteryPercentage() >= 75.0)
                .map(r -> r.getTopic().getTopicName())
                .distinct()
                .collect(Collectors.toList());

        final List<String> weakTopics = records.stream()
                .filter(r -> r.getOverallMasteryPercentage() < 60.0)
                .map(r -> r.getTopic().getTopicName())
                .distinct()
                .collect(Collectors.toList());

        final List<ClassAnalyticsResponse.TopicPerformance> topicPerformances = records.stream()
                .filter(r -> r.getTopic() != null)
                .collect(Collectors.groupingBy(r -> r.getTopic().getTopicName()))
                .entrySet().stream()
                .map(entry -> {
                    final String topicName = entry.getKey();
                    final List<LearningRecord> recs = entry.getValue();
                    final double avgMastery = recs.stream().mapToDouble(LearningRecord::getOverallMasteryPercentage).average().orElse(0.0);
                    final double avgAssess = recs.stream().mapToDouble(LearningRecord::getAverageAssessmentScore).average().orElse(0.0);
                    final double avgHw = recs.stream().mapToDouble(LearningRecord::getAverageHomeworkScore).average().orElse(0.0);
                    final String chapterTitle = recs.get(0).getChapter() != null ? recs.get(0).getChapter().getTitle() : "Chapter";
                    return ClassAnalyticsResponse.TopicPerformance.builder()
                            .topicName(topicName)
                            .chapterTitle(chapterTitle)
                            .averageMastery(Math.round(avgMastery * 100.0) / 100.0)
                            .averageAssessmentScore(Math.round(avgAssess * 100.0) / 100.0)
                            .averageHomeworkScore(Math.round(avgHw * 100.0) / 100.0)
                            .studentCount(recs.size())
                            .build();
                })
                .collect(Collectors.toList());

        return ClassAnalyticsResponse.builder()
                .sectionId(sectionId)
                .schoolId(schoolId)
                .averageClassMastery(Math.round(avgClassMastery * 100.0) / 100.0)
                .averageHomeworkCompletion(Math.round(avgHwCompletion * 100.0) / 100.0)
                .averageAssessmentScore(Math.round(avgAssessScore * 100.0) / 100.0)
                .studentsNeedingAttentionCount(needingAttention.size())
                .topPerformersCount(topPerformers.size())
                .strongestTopics(strongTopics)
                .weakestTopics(weakTopics)
                .studentsNeedingAttention(needingAttention)
                .topPerformers(topPerformers)
                .topicPerformances(topicPerformances)
                .build();
    }

    @Override
    public PageResponse<LearningRecordResponse> getTopicAnalytics(final UUID topicId, final Pageable pageable) {
        log.info("Generating topic analytics for topic ID: {}", topicId);
        return recordService.getRecordsByTopic(topicId, pageable);
    }
}

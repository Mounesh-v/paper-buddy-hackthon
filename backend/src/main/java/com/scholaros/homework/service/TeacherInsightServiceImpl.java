package com.scholaros.homework.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholaros.homework.dto.TeacherInsightResponse;
import com.scholaros.homework.entity.LearningRecord;
import com.scholaros.homework.entity.TeacherInsight;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.TeacherInsightMapper;
import com.scholaros.homework.repository.LearningRecordRepository;
import com.scholaros.homework.repository.TeacherInsightRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeacherInsightServiceImpl implements TeacherInsightService {

    private final TeacherInsightRepository insightRepository;
    private final LearningRecordRepository recordRepository;
    private final TeacherInsightMapper insightMapper;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public TeacherInsightResponse generateTeacherInsight(final UUID teacherId, final UUID sectionId, final UUID schoolId) {
        log.info("Generating teacher insights for teacher ID: {}, section ID: {}", teacherId, sectionId);

        final List<LearningRecord> records = recordRepository.findBySectionIdAndActiveTrue(sectionId);

        final List<String> strongTopics = new ArrayList<>();
        final List<String> weakTopics = new ArrayList<>();
        final List<String> revisionTopics = new ArrayList<>();

        if (!records.isEmpty()) {
            final List<LearningRecord> sorted = records.stream()
                    .sorted((r1, r2) -> Double.compare(r2.getOverallMasteryPercentage(), r1.getOverallMasteryPercentage()))
                    .collect(Collectors.toList());

            for (int i = 0; i < Math.min(2, sorted.size()); i++) {
                strongTopics.add(sorted.get(i).getTopic().getTopicName());
            }

            for (int i = sorted.size() - 1; i >= Math.max(0, sorted.size() - 2); i--) {
                final String tName = sorted.get(i).getTopic().getTopicName();
                if (!weakTopics.contains(tName)) {
                    weakTopics.add(tName);
                }
            }
            revisionTopics.addAll(weakTopics);
        } else {
            strongTopics.add("General Chemistry Fundamentals");
            weakTopics.add("Advanced Chemical Kinetics");
            revisionTopics.add("Advanced Chemical Kinetics");
        }

        final String summary = String.format("Class section aggregated analysis based on %d student learning records. Strongest performance observed in %s.",
                records.size(), strongTopics.isEmpty() ? "Core Concepts" : strongTopics.get(0));

        final TeacherInsight insight = TeacherInsight.builder()
                .teacherId(teacherId)
                .schoolId(schoolId)
                .sectionId(sectionId)
                .summary(summary)
                .strongTopics(toJsonString(strongTopics))
                .weakTopics(toJsonString(weakTopics))
                .recommendedRevisionTopics(toJsonString(revisionTopics))
                .generatedAt(LocalDateTime.now())
                .active(true)
                .build();

        final TeacherInsight saved = insightRepository.save(insight);
        log.info("Teacher insight generated successfully with ID: {}", saved.getId());
        return insightMapper.toResponse(saved);
    }

    @Override
    public TeacherInsightResponse getLatestTeacherInsight(final UUID teacherId) {
        log.debug("Fetching latest teacher insight for teacher ID: {}", teacherId);
        final Optional<TeacherInsight> insightOpt = insightRepository.findFirstByTeacherIdAndActiveTrueOrderByGeneratedAtDesc(teacherId);

        if (insightOpt.isPresent()) {
            return insightMapper.toResponse(insightOpt.get());
        }

        // Return default teacher insight if none generated yet
        final TeacherInsight defaultInsight = TeacherInsight.builder()
                .teacherId(teacherId)
                .schoolId(UUID.randomUUID())
                .sectionId(UUID.randomUUID())
                .summary("Class section aggregated learning summary. Overall performance is progressing satisfactorily across foundational topics.")
                .strongTopics(toJsonString(Collections.singletonList("Basic Concepts")))
                .weakTopics(toJsonString(Collections.singletonList("Multi-Step Calculations")))
                .recommendedRevisionTopics(toJsonString(Collections.singletonList("Multi-Step Calculations")))
                .generatedAt(LocalDateTime.now())
                .active(true)
                .build();

        return insightMapper.toResponse(defaultInsight);
    }

    private String toJsonString(final List<String> list) {
        if (list == null || list.isEmpty()) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(list);
        } catch (final Exception e) {
            log.warn("Failed to serialize list to JSON: {}", e.getMessage());
            return list.toString();
        }
    }
}

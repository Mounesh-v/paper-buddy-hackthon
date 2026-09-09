package com.scholaros.homework.service;

import com.scholaros.homework.dto.LearningRecordResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.entity.Assessment;
import com.scholaros.homework.entity.AssessmentAttempt;
import com.scholaros.homework.entity.Chapter;
import com.scholaros.homework.entity.ConceptMastery;
import com.scholaros.homework.entity.Curriculum;
import com.scholaros.homework.entity.HomeworkAssignment;
import com.scholaros.homework.entity.HomeworkSubmission;
import com.scholaros.homework.entity.LearningRecord;
import com.scholaros.homework.entity.MasteryStatus;
import com.scholaros.homework.entity.Topic;
import com.scholaros.homework.mapper.LearningRecordMapper;
import com.scholaros.homework.repository.LearningRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LearningRecordServiceImpl implements LearningRecordService {

    private final LearningRecordRepository recordRepository;
    private final LearningRecordMapper recordMapper;

    @Override
    @Transactional
    public void updateRecordFromAssessment(final AssessmentAttempt attempt) {
        final Assessment assessment = attempt.getAssessment();
        if (assessment == null || assessment.getLessonSession() == null) {
            return;
        }

        final Topic topic = assessment.getLessonSession().getTopic();
        final Chapter chapter = assessment.getLessonSession().getChapter();
        final Curriculum curriculum = assessment.getLessonSession().getCurriculum();

        if (topic == null || chapter == null || curriculum == null) {
            return;
        }

        final UUID studentId = attempt.getStudentId();
        log.info("Updating learning record from assessment for studentId: {}, topicId: {}", studentId, topic.getId());

        final Optional<LearningRecord> recordOpt = recordRepository.findByStudentIdAndTopicIdAndActiveTrue(studentId, topic.getId());

        final LearningRecord record;
        if (recordOpt.isPresent()) {
            record = recordOpt.get();
        } else {
            record = LearningRecord.builder()
                    .studentId(studentId)
                    .schoolId(attempt.getSchoolId())
                    .sectionId(attempt.getSectionId())
                    .curriculum(curriculum)
                    .chapter(chapter)
                    .topic(topic)
                    .overallMasteryPercentage(0.0)
                    .averageAssessmentScore(0.0)
                    .averageHomeworkScore(0.0)
                    .averageCompletionRate(0.0)
                    .totalAssessments(0)
                    .totalHomework(0)
                    .totalStudyMinutes(0)
                    .lastUpdated(LocalDateTime.now())
                    .active(true)
                    .build();
        }

        final int prevTotal = record.getTotalAssessments();
        final double prevAvgScore = record.getAverageAssessmentScore();
        final double newScore = attempt.getPercentage() != null ? attempt.getPercentage() : 0.0;

        final double updatedAvgScore = ((prevAvgScore * prevTotal) + newScore) / (prevTotal + 1);

        record.setTotalAssessments(prevTotal + 1);
        record.setAverageAssessmentScore(Math.round(updatedAvgScore * 100.0) / 100.0);
        record.setTotalStudyMinutes(record.getTotalStudyMinutes() + (attempt.getTimeTakenSeconds() != null ? attempt.getTimeTakenSeconds() / 60 : 15));
        record.setLastAssessmentDate(attempt.getSubmittedAt() != null ? attempt.getSubmittedAt() : LocalDateTime.now());
        record.setLastUpdated(LocalDateTime.now());

        recalculateOverallMastery(record);
        updateConceptMasteries(record, topic.getTopicName(), newScore);

        recordRepository.save(record);
        log.info("Learning record updated successfully for studentId: {}, topicId: {}", studentId, topic.getId());
    }

    @Override
    @Transactional
    public void updateRecordFromHomework(final HomeworkSubmission submission) {
        final HomeworkAssignment assignment = submission.getHomeworkAssignment();
        if (assignment == null || assignment.getLessonSession() == null) {
            return;
        }

        final Topic topic = assignment.getLessonSession().getTopic();
        final Chapter chapter = assignment.getLessonSession().getChapter();
        final Curriculum curriculum = assignment.getLessonSession().getCurriculum();

        if (topic == null || chapter == null || curriculum == null) {
            return;
        }

        final UUID studentId = assignment.getStudentId();
        log.info("Updating learning record from homework submission for studentId: {}, topicId: {}", studentId, topic.getId());

        final Optional<LearningRecord> recordOpt = recordRepository.findByStudentIdAndTopicIdAndActiveTrue(studentId, topic.getId());

        final LearningRecord record;
        if (recordOpt.isPresent()) {
            record = recordOpt.get();
        } else {
            record = LearningRecord.builder()
                    .studentId(studentId)
                    .schoolId(assignment.getSchoolId())
                    .sectionId(assignment.getSectionId())
                    .curriculum(curriculum)
                    .chapter(chapter)
                    .topic(topic)
                    .overallMasteryPercentage(0.0)
                    .averageAssessmentScore(0.0)
                    .averageHomeworkScore(0.0)
                    .averageCompletionRate(0.0)
                    .totalAssessments(0)
                    .totalHomework(0)
                    .totalStudyMinutes(0)
                    .lastUpdated(LocalDateTime.now())
                    .active(true)
                    .build();
        }

        final int prevTotalHw = record.getTotalHomework();
        final double prevAvgHwScore = record.getAverageHomeworkScore();
        final double newHwScore = submission.getPercentage() != null ? submission.getPercentage() : 100.0;

        final double updatedAvgHwScore = ((prevAvgHwScore * prevTotalHw) + newHwScore) / (prevTotalHw + 1);

        record.setTotalHomework(prevTotalHw + 1);
        record.setAverageHomeworkScore(Math.round(updatedAvgHwScore * 100.0) / 100.0);
        record.setAverageCompletionRate(100.0);
        record.setTotalStudyMinutes(record.getTotalStudyMinutes() + (submission.getTimeTakenMinutes() != null ? submission.getTimeTakenMinutes() : 15));
        record.setLastHomeworkDate(submission.getSubmittedAt() != null ? submission.getSubmittedAt() : LocalDateTime.now());
        record.setLastUpdated(LocalDateTime.now());

        recalculateOverallMastery(record);
        updateConceptMasteries(record, topic.getTopicName(), newHwScore);

        recordRepository.save(record);
        log.info("Learning record updated successfully from homework for studentId: {}, topicId: {}", studentId, topic.getId());
    }

    @Override
    public List<LearningRecordResponse> getRecordsByStudent(final UUID studentId) {
        log.debug("Fetching learning records for student ID: {}", studentId);
        return recordRepository.findByStudentIdAndActiveTrue(studentId).stream()
                .map(recordMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PageResponse<LearningRecordResponse> getRecordsByTopic(final UUID topicId, final Pageable pageable) {
        log.debug("Fetching learning records for topic ID: {}", topicId);
        final Page<LearningRecordResponse> page = recordRepository.findByTopicIdAndActiveTrue(topicId, pageable)
                .map(recordMapper::toResponse);
        return PageResponse.from(page);
    }

    private void recalculateOverallMastery(final LearningRecord record) {
        final double assessmentWeight = 0.6;
        final double homeworkWeight = 0.4;

        double overall;
        if (record.getTotalAssessments() > 0 && record.getTotalHomework() > 0) {
            overall = (record.getAverageAssessmentScore() * assessmentWeight) + (record.getAverageHomeworkScore() * homeworkWeight);
        } else if (record.getTotalAssessments() > 0) {
            overall = record.getAverageAssessmentScore();
        } else {
            overall = record.getAverageHomeworkScore();
        }
        record.setOverallMasteryPercentage(Math.round(overall * 100.0) / 100.0);
    }

    private void updateConceptMasteries(final LearningRecord record, final String conceptName, final double score) {
        if (record.getConceptMasteries() == null) {
            record.setConceptMasteries(new ArrayList<>());
        }

        final Optional<ConceptMastery> existingConceptOpt = record.getConceptMasteries().stream()
                .filter(c -> c.getConceptName().equalsIgnoreCase(conceptName))
                .findFirst();

        final MasteryStatus status = deriveMasteryStatus(score);

        if (existingConceptOpt.isPresent()) {
            final ConceptMastery concept = existingConceptOpt.get();
            final double prevPct = concept.getMasteryPercentage();
            concept.setImprovementPercentage(Math.round((score - prevPct) * 100.0) / 100.0);
            concept.setMasteryPercentage(score);
            concept.setMasteryLevel(status);
            concept.setAttemptCount(concept.getAttemptCount() + 1);
            concept.setLastPracticed(LocalDateTime.now());
        } else {
            record.getConceptMasteries().add(ConceptMastery.builder()
                    .learningRecord(record)
                    .conceptName(conceptName)
                    .masteryLevel(status)
                    .masteryPercentage(score)
                    .attemptCount(1)
                    .improvementPercentage(0.0)
                    .lastPracticed(LocalDateTime.now())
                    .build());
        }
    }

    private MasteryStatus deriveMasteryStatus(final double score) {
        if (score >= 90.0) return MasteryStatus.MASTERED;
        if (score >= 75.0) return MasteryStatus.PROFICIENT;
        if (score >= 50.0) return MasteryStatus.DEVELOPING;
        if (score >= 35.0) return MasteryStatus.AT_RISK;
        return MasteryStatus.CRITICAL;
    }
}

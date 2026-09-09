package com.scholaros.homework.service;

import com.scholaros.homework.dto.HomeworkFeedbackResponse;
import com.scholaros.homework.entity.FeedbackSource;
import com.scholaros.homework.entity.HomeworkFeedback;
import com.scholaros.homework.entity.HomeworkSubmission;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.HomeworkFeedbackMapper;
import com.scholaros.homework.repository.HomeworkFeedbackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HomeworkFeedbackServiceImpl implements HomeworkFeedbackService {

    private final HomeworkFeedbackRepository feedbackRepository;
    private final HomeworkFeedbackMapper feedbackMapper;

    @Override
    @Transactional
    public HomeworkFeedbackResponse generateFeedbackForSubmission(final HomeworkSubmission submission) {
        log.info("Generating automated feedback for homework submission ID: {}", submission.getId());

        final String summary = String.format("Completed homework submission with score %.1f%%.", submission.getPercentage());
        final String strengths = "Good effort in attempting all assigned practice questions.";
        final String weaknesses = submission.getPercentage() < 75.0 ? "Review step-by-step problem formulations." : "Minor review of edge cases suggested.";
        final String nextSteps = "Continue regular practice and clarify any remaining doubts with your teacher.";

        final HomeworkFeedback feedback = HomeworkFeedback.builder()
                .homeworkSubmission(submission)
                .feedbackSummary(summary)
                .strengths(strengths)
                .weaknesses(weaknesses)
                .nextSteps(nextSteps)
                .source(FeedbackSource.AI)
                .generatedByAI(true)
                .build();

        final HomeworkFeedback saved = feedbackRepository.save(feedback);
        log.info("Homework feedback created successfully with ID: {}", saved.getId());
        return feedbackMapper.toResponse(saved);
    }

    @Override
    public HomeworkFeedbackResponse getFeedbackByHomeworkId(final UUID homeworkAssignmentId) {
        log.debug("Fetching feedback for homework assignment ID: {}", homeworkAssignmentId);
        final HomeworkFeedback feedback = feedbackRepository.findByHomeworkSubmissionHomeworkAssignmentId(homeworkAssignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("HomeworkFeedback", "homeworkAssignmentId", homeworkAssignmentId));
        return feedbackMapper.toResponse(feedback);
    }
}

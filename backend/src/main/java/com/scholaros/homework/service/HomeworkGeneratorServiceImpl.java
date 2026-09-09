package com.scholaros.homework.service;

import com.scholaros.homework.dto.GenerateHomeworkRequest;
import com.scholaros.homework.dto.HomeworkAssignmentResponse;
import com.scholaros.homework.entity.AssessmentAttempt;
import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.entity.HomeworkAssignment;
import com.scholaros.homework.entity.HomeworkQuestion;
import com.scholaros.homework.entity.HomeworkRecommendation;
import com.scholaros.homework.entity.HomeworkStatus;
import com.scholaros.homework.entity.LessonSession;
import com.scholaros.homework.entity.QuestionType;
import com.scholaros.homework.exception.BadRequestException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.HomeworkAssignmentMapper;
import com.scholaros.homework.repository.HomeworkAssignmentRepository;
import com.scholaros.homework.repository.HomeworkRecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HomeworkGeneratorServiceImpl implements HomeworkGeneratorService {

    private final HomeworkRecommendationRepository recommendationRepository;
    private final HomeworkAssignmentRepository assignmentRepository;
    private final HomeworkAssignmentMapper assignmentMapper;

    @Override
    @Transactional
    public HomeworkAssignmentResponse generateHomeworkFromRecommendation(final GenerateHomeworkRequest request) {
        log.info("Generating personalized homework for recommendation ID: {}", request.getHomeworkRecommendationId());

        if (assignmentRepository.existsByHomeworkRecommendationIdAndActiveTrue(request.getHomeworkRecommendationId())) {
            throw new BadRequestException("A homework assignment has already been generated from this recommendation");
        }

        final HomeworkRecommendation rec = recommendationRepository.findById(request.getHomeworkRecommendationId())
                .orElseThrow(() -> new ResourceNotFoundException("HomeworkRecommendation", "id", request.getHomeworkRecommendationId()));

        final AssessmentAttempt attempt = rec.getLearningAnalysis().getAssessmentAttempt();
        final LessonSession lessonSession = attempt.getAssessment().getLessonSession();

        final LocalDateTime now = LocalDateTime.now();
        final LocalDateTime dueDate = request.getDueDate() != null ? request.getDueDate() : now.plusDays(3);

        if (!dueDate.isAfter(now)) {
            throw new BadRequestException("Due date must be after the assigned date");
        }

        final DifficultyLevel diff = rec.getRecommendedDifficulty() != null ? rec.getRecommendedDifficulty() : DifficultyLevel.INTERMEDIATE;
        final int questionCount = rec.getRecommendedQuestionCount() != null ? rec.getRecommendedQuestionCount() : 5;
        final int practiceMinutes = rec.getRecommendedPracticeMinutes() != null ? rec.getRecommendedPracticeMinutes() : 15;

        final HomeworkAssignment assignment = HomeworkAssignment.builder()
                .lessonSession(lessonSession)
                .homeworkRecommendation(rec)
                .studentId(attempt.getStudentId())
                .teacherId(request.getTeacherId())
                .schoolId(attempt.getSchoolId())
                .sectionId(attempt.getSectionId())
                .title("Personalized Practice: " + lessonSession.getTopic().getTopicName())
                .description("Targeted homework assignment based on AI recommendation to reinforce key learning concepts.")
                .difficultyLevel(diff)
                .estimatedDurationMinutes(practiceMinutes)
                .assignedDate(now)
                .dueDate(dueDate)
                .status(HomeworkStatus.ASSIGNED)
                .totalQuestions(questionCount)
                .completedQuestions(0)
                .completionPercentage(0.0)
                .generatedByAI(true)
                .active(true)
                .build();

        // Generate personalized questions
        final List<HomeworkQuestion> questions = generatePracticeQuestions(assignment, questionCount, diff);
        assignment.setQuestions(questions);

        final HomeworkAssignment saved = assignmentRepository.save(assignment);
        log.info("Homework assignment generated successfully with ID: {}", saved.getId());
        return assignmentMapper.toResponse(saved);
    }

    private List<HomeworkQuestion> generatePracticeQuestions(final HomeworkAssignment assignment, final int count, final DifficultyLevel diff) {
        final List<HomeworkQuestion> list = new ArrayList<>();
        final String topicName = assignment.getLessonSession().getTopic().getTopicName();

        for (int i = 1; i <= count; i++) {
            final QuestionType type = (i % 2 == 1) ? QuestionType.MULTIPLE_CHOICE : QuestionType.SHORT_ANSWER;
            list.add(HomeworkQuestion.builder()
                    .homeworkAssignment(assignment)
                    .questionText(String.format("Practice Question %d on %s: Apply core principles to solve this problem.", i, topicName))
                    .questionType(type)
                    .difficultyLevel(diff)
                    .marks(2)
                    .correctAnswer("Sample correct answer step for question " + i)
                    .explanation("Detailed explanation for mastering " + topicName)
                    .displayOrder(i)
                    .build());
        }
        return list;
    }
}

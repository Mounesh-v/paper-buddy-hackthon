package com.scholaros.homework.ai;

import com.scholaros.homework.entity.Assessment;
import com.scholaros.homework.entity.AssessmentAttempt;
import com.scholaros.homework.entity.Question;
import com.scholaros.homework.entity.QuestionOption;
import com.scholaros.homework.entity.StudentAnswer;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class PromptBuilder {

    public String buildAnalysisPrompt(
            final AssessmentAttempt attempt,
            final Assessment assessment,
            final List<Question> questions,
            final List<StudentAnswer> studentAnswers
    ) {
        final Map<UUID, StudentAnswer> answerMap = studentAnswers.stream()
                .collect(Collectors.toMap(a -> a.getQuestion().getId(), Function.identity(), (a1, a2) -> a1));

        final StringBuilder sb = new StringBuilder();
        sb.append("You are an expert AI Educational Analytics and Learning Assessment Engine for ScholarOS.\n");
        sb.append("Analyze the following student assessment attempt and generate a structured JSON analysis and homework recommendation.\n\n");

        sb.append("--- ASSESSMENT METADATA ---\n");
        sb.append("Title: ").append(assessment.getTitle()).append("\n");
        sb.append("Type: ").append(assessment.getAssessmentType()).append("\n");
        if (assessment.getLessonSession() != null && assessment.getLessonSession().getTopic() != null) {
            sb.append("Topic: ").append(assessment.getLessonSession().getTopic().getTopicName()).append("\n");
            if (assessment.getLessonSession().getChapter() != null) {
                sb.append("Chapter: ").append(assessment.getLessonSession().getChapter().getTitle()).append("\n");
            }
        }
        sb.append("Total Assessment Marks: ").append(assessment.getTotalMarks()).append("\n\n");

        sb.append("--- STUDENT ATTEMPT SUMMARY ---\n");
        sb.append("Score: ").append(attempt.getScore()).append(" / ").append(attempt.getMaximumScore()).append("\n");
        sb.append("Percentage: ").append(attempt.getPercentage()).append("%\n");
        sb.append("Time Taken: ").append(attempt.getTimeTakenSeconds() != null ? attempt.getTimeTakenSeconds() : 0).append(" seconds\n\n");

        sb.append("--- QUESTION & ANSWER DETAILS ---\n");
        int qNum = 1;
        for (final Question q : questions) {
            sb.append("Q").append(qNum++).append(": ").append(q.getQuestionText()).append("\n");
            sb.append("   Type: ").append(q.getQuestionType()).append(" | Marks: ").append(q.getMarks()).append("\n");

            final StudentAnswer answer = answerMap.get(q.getId());
            if (answer != null) {
                sb.append("   Student Answer: ");
                if (answer.getSelectedOptionId() != null) {
                    final String optionText = q.getOptions().stream()
                            .filter(o -> o.getId().equals(answer.getSelectedOptionId()))
                            .map(QuestionOption::getOptionText)
                            .findFirst()
                            .orElse(answer.getSelectedOptionId().toString());
                    sb.append(optionText);
                } else if (answer.getAnswerText() != null) {
                    sb.append(answer.getAnswerText());
                } else {
                    sb.append("[No Answer]");
                }
                sb.append("\n");
                sb.append("   Result: ").append(Boolean.TRUE.equals(answer.getCorrect()) ? "CORRECT" : "INCORRECT");
                sb.append(" (Awarded ").append(answer.getMarksAwarded()).append(" marks)\n");
            } else {
                sb.append("   Student Answer: [UNANSWERED]\n");
            }
            sb.append("\n");
        }

        sb.append("--- INSTRUCTIONS ---\n");
        sb.append("Return ONLY a valid JSON object matching the following structure without any markdown wrap or extra commentary:\n");
        sb.append("{\n");
        sb.append("  \"overallMasteryPercentage\": 85.0,\n");
        sb.append("  \"masteryLevel\": \"EXCELLENT\" | \"GOOD\" | \"AVERAGE\" | \"NEEDS_IMPROVEMENT\" | \"CRITICAL\",\n");
        sb.append("  \"strongConcepts\": [\"Concept 1\", \"Concept 2\"],\n");
        sb.append("  \"weakConcepts\": [\"Weakness 1\"],\n");
        sb.append("  \"misconceptions\": [\"Misconception 1\"],\n");
        sb.append("  \"confidenceScore\": 0.90,\n");
        sb.append("  \"recommendedDifficulty\": \"BEGINNER\" | \"INTERMEDIATE\" | \"ADVANCED\",\n");
        sb.append("  \"recommendedStudyMinutes\": 20,\n");
        sb.append("  \"analysisSummary\": \"Detailed qualitative analysis summary...\",\n");
        sb.append("  \"recommendedQuestionCount\": 5,\n");
        sb.append("  \"recommendedPracticeMinutes\": 15,\n");
        sb.append("  \"recommendedTopics\": [\"Topic 1\", \"Topic 2\"],\n");
        sb.append("  \"recommendedQuestionTypes\": [\"MULTIPLE_CHOICE\", \"SHORT_ANSWER\"],\n");
        sb.append("  \"priorityLevel\": \"LOW\" | \"MEDIUM\" | \"HIGH\" | \"URGENT\",\n");
        sb.append("  \"recommendationReason\": \"Reason for homework recommendation...\"\n");
        sb.append("}\n");

        return sb.toString();
    }
}

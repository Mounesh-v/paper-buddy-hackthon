package com.scholaros.homework.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.entity.HomeworkStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomeworkAssignmentResponse {

    private UUID id;
    private UUID lessonSessionId;
    private String lessonTitle;
    private UUID homeworkRecommendationId;

    // ERP Reference UUIDs
    private UUID studentId;
    private UUID teacherId;
    private UUID schoolId;
    private UUID sectionId;

    private String title;
    private String description;
    private DifficultyLevel difficultyLevel;
    private Integer estimatedDurationMinutes;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime assignedDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dueDate;

    private HomeworkStatus status;
    private Integer totalQuestions;
    private Integer completedQuestions;
    private Double completionPercentage;
    private Boolean generatedByAI;
    private Boolean active;

    private List<HomeworkQuestionResponse> questions;
    private HomeworkSubmissionResponse submission;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
}

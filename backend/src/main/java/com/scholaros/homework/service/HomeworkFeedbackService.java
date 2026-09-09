package com.scholaros.homework.service;

import com.scholaros.homework.dto.HomeworkFeedbackResponse;
import com.scholaros.homework.entity.HomeworkSubmission;

import java.util.UUID;

public interface HomeworkFeedbackService {

    HomeworkFeedbackResponse generateFeedbackForSubmission(HomeworkSubmission submission);

    HomeworkFeedbackResponse getFeedbackByHomeworkId(UUID homeworkAssignmentId);
}

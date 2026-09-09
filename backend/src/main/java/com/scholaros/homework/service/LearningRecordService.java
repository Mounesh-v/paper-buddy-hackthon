package com.scholaros.homework.service;

import com.scholaros.homework.dto.LearningRecordResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.entity.AssessmentAttempt;
import com.scholaros.homework.entity.HomeworkSubmission;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface LearningRecordService {

    void updateRecordFromAssessment(AssessmentAttempt attempt);

    void updateRecordFromHomework(HomeworkSubmission submission);

    List<LearningRecordResponse> getRecordsByStudent(UUID studentId);

    PageResponse<LearningRecordResponse> getRecordsByTopic(UUID topicId, Pageable pageable);
}

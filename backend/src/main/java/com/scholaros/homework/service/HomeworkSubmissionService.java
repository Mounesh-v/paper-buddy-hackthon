package com.scholaros.homework.service;

import com.scholaros.homework.dto.HomeworkSubmissionRequest;
import com.scholaros.homework.dto.HomeworkSubmissionResponse;

import java.util.UUID;

public interface HomeworkSubmissionService {

    HomeworkSubmissionResponse submitHomework(UUID homeworkAssignmentId, HomeworkSubmissionRequest request);

    HomeworkSubmissionResponse getSubmissionByHomeworkId(UUID homeworkAssignmentId);
}

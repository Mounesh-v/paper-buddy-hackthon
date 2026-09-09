package com.scholaros.homework.service;

import com.scholaros.homework.dto.AssessmentAttemptResponse;
import com.scholaros.homework.dto.AssessmentResultResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.SaveAnswerRequest;
import com.scholaros.homework.dto.StartAssessmentRequest;
import com.scholaros.homework.dto.StudentAnswerResponse;
import com.scholaros.homework.dto.SubmitAssessmentRequest;
import com.scholaros.homework.entity.AttemptStatus;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.UUID;

public interface AssessmentAttemptService {

    AssessmentAttemptResponse startAssessment(StartAssessmentRequest request);

    StudentAnswerResponse saveAnswer(UUID attemptId, SaveAnswerRequest request);

    StudentAnswerResponse updateAnswer(UUID attemptId, UUID questionId, SaveAnswerRequest request);

    AssessmentAttemptResponse submitAssessment(UUID attemptId, SubmitAssessmentRequest request);

    AssessmentAttemptResponse getAttemptById(UUID attemptId);

    PageResponse<AssessmentAttemptResponse> getAttemptsByStudent(UUID studentId, Pageable pageable);

    PageResponse<AssessmentAttemptResponse> searchAttempts(
            UUID studentId,
            UUID assessmentId,
            AttemptStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable
    );

    AssessmentResultResponse getAttemptResult(UUID attemptId);
}

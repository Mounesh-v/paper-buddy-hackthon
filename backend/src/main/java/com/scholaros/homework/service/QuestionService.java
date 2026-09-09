package com.scholaros.homework.service;

import com.scholaros.homework.dto.CreateQuestionRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.QuestionResponse;
import com.scholaros.homework.dto.UpdateQuestionRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface QuestionService {

    QuestionResponse createQuestion(CreateQuestionRequest request);

    QuestionResponse getQuestionById(UUID id);

    List<QuestionResponse> getQuestionsByAssessment(UUID assessmentId);

    PageResponse<QuestionResponse> getQuestionsByAssessment(UUID assessmentId, Pageable pageable);

    QuestionResponse updateQuestion(UUID id, UpdateQuestionRequest request);

    void deleteQuestion(UUID id);
}

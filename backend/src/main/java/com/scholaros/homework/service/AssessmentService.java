package com.scholaros.homework.service;

import com.scholaros.homework.dto.AssessmentResponse;
import com.scholaros.homework.dto.AssessmentSearchRequest;
import com.scholaros.homework.dto.CreateAssessmentRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateAssessmentRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AssessmentService {

    AssessmentResponse createAssessment(CreateAssessmentRequest request);

    AssessmentResponse getAssessmentById(UUID id);

    PageResponse<AssessmentResponse> getAllAssessments(Pageable pageable);

    PageResponse<AssessmentResponse> searchAssessments(AssessmentSearchRequest searchRequest, Pageable pageable);

    AssessmentResponse updateAssessment(UUID id, UpdateAssessmentRequest request);

    AssessmentResponse publishAssessment(UUID id);

    AssessmentResponse closeAssessment(UUID id);

    AssessmentResponse cancelAssessment(UUID id);

    void deleteAssessment(UUID id);
}

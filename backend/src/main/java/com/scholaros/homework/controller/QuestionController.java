package com.scholaros.homework.controller;

import com.scholaros.homework.common.ApiResponse;
import com.scholaros.homework.dto.CreateQuestionRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.QuestionResponse;
import com.scholaros.homework.dto.UpdateQuestionRequest;
import com.scholaros.homework.service.QuestionService;
import com.scholaros.homework.util.ApiConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping(ApiConstants.API_V1_PREFIX)
@RequiredArgsConstructor
@Tag(name = "Question Management", description = "APIs for managing questions in assessments")
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/questions")
    @Operation(summary = "Create question", description = "Adds a question to an assessment")
    public ResponseEntity<ApiResponse<QuestionResponse>> createQuestion(@Valid @RequestBody final CreateQuestionRequest request) {
        log.info("REST request to create question for assessment ID: {}", request.getAssessmentId());
        final QuestionResponse response = questionService.createQuestion(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Question created successfully"));
    }

    @GetMapping("/questions/{id}")
    @Operation(summary = "Get question by ID", description = "Retrieves an active question by UUID")
    public ResponseEntity<ApiResponse<QuestionResponse>> getQuestionById(@PathVariable final UUID id) {
        log.info("REST request to get question by ID: {}", id);
        final QuestionResponse response = questionService.getQuestionById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/assessments/{id}/questions")
    @Operation(summary = "Get questions by assessment", description = "Retrieves all questions for an assessment")
    public ResponseEntity<ApiResponse<PageResponse<QuestionResponse>>> getQuestionsByAssessment(
            @PathVariable("id") final UUID assessmentId,
            @PageableDefault(sort = "displayOrder", direction = Sort.Direction.ASC) final Pageable pageable
    ) {
        log.info("REST request to get questions for assessment ID: {}", assessmentId);
        final PageResponse<QuestionResponse> page = questionService.getQuestionsByAssessment(assessmentId, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @PutMapping("/questions/{id}")
    @Operation(summary = "Update question", description = "Updates an existing question")
    public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(
            @PathVariable final UUID id,
            @Valid @RequestBody final UpdateQuestionRequest request
    ) {
        log.info("REST request to update question ID: {}", id);
        final QuestionResponse response = questionService.updateQuestion(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Question updated successfully"));
    }

    @DeleteMapping("/questions/{id}")
    @Operation(summary = "Soft delete question", description = "Deactivates a question by setting active to false")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable final UUID id) {
        log.info("REST request to delete question ID: {}", id);
        questionService.deleteQuestion(id);
        return ResponseEntity.ok(ApiResponse.success("Question deleted successfully"));
    }
}

package com.scholaros.homework.controller;

import com.scholaros.homework.common.ApiResponse;
import com.scholaros.homework.dto.AssessmentAttemptResponse;
import com.scholaros.homework.dto.AssessmentResultResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.SaveAnswerRequest;
import com.scholaros.homework.dto.StartAssessmentRequest;
import com.scholaros.homework.dto.StudentAnswerResponse;
import com.scholaros.homework.dto.SubmitAssessmentRequest;
import com.scholaros.homework.entity.AttemptStatus;
import com.scholaros.homework.service.AssessmentAttemptService;
import com.scholaros.homework.util.ApiConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping(ApiConstants.API_V1_PREFIX + "/assessment-attempts")
@RequiredArgsConstructor
@Tag(name = "Assessment Execution & Evaluation", description = "APIs for starting assessments, saving progress, submitting attempts, and fetching evaluation results")
public class AssessmentAttemptController {

    private final AssessmentAttemptService attemptService;

    @PostMapping("/start")
    @Operation(summary = "Start assessment attempt", description = "Starts a new assessment attempt for a student")
    public ResponseEntity<ApiResponse<AssessmentAttemptResponse>> startAssessment(
            @Valid @RequestBody final StartAssessmentRequest request
    ) {
        log.info("REST request to start assessment ID: {} for student ID: {}", request.getAssessmentId(), request.getStudentId());
        final AssessmentAttemptResponse response = attemptService.startAssessment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Assessment attempt started successfully"));
    }

    @PostMapping("/{id}/answers")
    @Operation(summary = "Save student answer", description = "Saves or updates a student's answer for a question in an active attempt")
    public ResponseEntity<ApiResponse<StudentAnswerResponse>> saveAnswer(
            @PathVariable("id") final UUID attemptId,
            @Valid @RequestBody final SaveAnswerRequest request
    ) {
        log.info("REST request to save answer for attempt ID: {}", attemptId);
        final StudentAnswerResponse response = attemptService.saveAnswer(attemptId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Answer saved successfully"));
    }

    @PutMapping("/{id}/answers/{questionId}")
    @Operation(summary = "Update student answer", description = "Updates a student's answer for a specific question")
    public ResponseEntity<ApiResponse<StudentAnswerResponse>> updateAnswer(
            @PathVariable("id") final UUID attemptId,
            @PathVariable("questionId") final UUID questionId,
            @Valid @RequestBody final SaveAnswerRequest request
    ) {
        log.info("REST request to update answer for attempt ID: {}, question ID: {}", attemptId, questionId);
        final StudentAnswerResponse response = attemptService.updateAnswer(attemptId, questionId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Answer updated successfully"));
    }

    @PostMapping("/{id}/submit")
    @Operation(summary = "Submit assessment attempt", description = "Submits the assessment attempt and triggers automatic evaluation for objective questions")
    public ResponseEntity<ApiResponse<AssessmentAttemptResponse>> submitAssessment(
            @PathVariable("id") final UUID attemptId,
            @RequestBody(required = false) final SubmitAssessmentRequest request
    ) {
        log.info("REST request to submit assessment attempt ID: {}", attemptId);
        final AssessmentAttemptResponse response = attemptService.submitAssessment(attemptId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Assessment submitted and evaluated successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get assessment attempt by ID", description = "Retrieves an active assessment attempt by UUID")
    public ResponseEntity<ApiResponse<AssessmentAttemptResponse>> getAttemptById(@PathVariable final UUID id) {
        log.info("REST request to get attempt ID: {}", id);
        final AssessmentAttemptResponse response = attemptService.getAttemptById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get attempts by student", description = "Retrieves paginated attempt history for a student")
    public ResponseEntity<ApiResponse<PageResponse<AssessmentAttemptResponse>>> getAttemptsByStudent(
            @PathVariable final UUID studentId,
            @PageableDefault(sort = "startedAt", direction = Sort.Direction.DESC) final Pageable pageable
    ) {
        log.info("REST request to get attempts for student ID: {}", studentId);
        final PageResponse<AssessmentAttemptResponse> page = attemptService.getAttemptsByStudent(studentId, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/search")
    @Operation(summary = "Search & filter assessment attempts", description = "Search attempts by student, assessment, status, and date range")
    public ResponseEntity<ApiResponse<PageResponse<AssessmentAttemptResponse>>> searchAttempts(
            @RequestParam(required = false) final UUID studentId,
            @RequestParam(required = false) final UUID assessmentId,
            @RequestParam(required = false) final AttemptStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime endDate,
            @PageableDefault(sort = "startedAt", direction = Sort.Direction.DESC) final Pageable pageable
    ) {
        log.info("REST request to search assessment attempts");
        final PageResponse<AssessmentAttemptResponse> page = attemptService.searchAttempts(studentId, assessmentId, status, startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/{id}/result")
    @Operation(summary = "Get assessment result", description = "Retrieves full result breakdown and evaluation metrics for a submitted attempt")
    public ResponseEntity<ApiResponse<AssessmentResultResponse>> getAttemptResult(@PathVariable final UUID id) {
        log.info("REST request to get result for attempt ID: {}", id);
        final AssessmentResultResponse response = attemptService.getAttemptResult(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

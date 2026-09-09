package com.scholaros.homework.controller;

import com.scholaros.homework.common.ApiResponse;
import com.scholaros.homework.dto.AssessmentResponse;
import com.scholaros.homework.dto.AssessmentSearchRequest;
import com.scholaros.homework.dto.CreateAssessmentRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateAssessmentRequest;
import com.scholaros.homework.entity.AssessmentStatus;
import com.scholaros.homework.entity.AssessmentType;
import com.scholaros.homework.service.AssessmentService;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
@RequestMapping(ApiConstants.API_V1_PREFIX + "/assessments")
@RequiredArgsConstructor
@Tag(name = "Assessment Management", description = "APIs for managing assessments, configurations, and publishing workflow")
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping
    @Operation(summary = "Create assessment", description = "Creates a new assessment for a COMPLETED lesson session")
    public ResponseEntity<ApiResponse<AssessmentResponse>> createAssessment(
            @Valid @RequestBody final CreateAssessmentRequest request
    ) {
        log.info("REST request to create assessment: {}", request.getTitle());
        final AssessmentResponse response = assessmentService.createAssessment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Assessment created successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get assessment by ID", description = "Retrieves an active assessment by UUID")
    public ResponseEntity<ApiResponse<AssessmentResponse>> getAssessmentById(@PathVariable final UUID id) {
        log.info("REST request to get assessment ID: {}", id);
        final AssessmentResponse response = assessmentService.getAssessmentById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Get all active assessments", description = "Retrieves paginated active assessments")
    public ResponseEntity<ApiResponse<PageResponse<AssessmentResponse>>> getAllAssessments(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) final Pageable pageable
    ) {
        log.info("REST request to list active assessments");
        final PageResponse<AssessmentResponse> page = assessmentService.getAllAssessments(pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/search")
    @Operation(summary = "Search & filter assessments", description = "Search assessments by lesson session, status, assessment type, date range, and keyword")
    public ResponseEntity<ApiResponse<PageResponse<AssessmentResponse>>> searchAssessments(
            @RequestParam(required = false) final UUID lessonSessionId,
            @RequestParam(required = false) final AssessmentStatus status,
            @RequestParam(required = false) final AssessmentType assessmentType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime availableFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime availableUntil,
            @RequestParam(required = false) final String query,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) final Pageable pageable
    ) {
        log.info("REST request to search assessments");
        final AssessmentSearchRequest searchRequest = AssessmentSearchRequest.builder()
                .lessonSessionId(lessonSessionId)
                .status(status)
                .assessmentType(assessmentType)
                .availableFrom(availableFrom)
                .availableUntil(availableUntil)
                .query(query)
                .build();

        final PageResponse<AssessmentResponse> page = assessmentService.searchAssessments(searchRequest, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update assessment", description = "Updates an existing assessment in DRAFT status")
    public ResponseEntity<ApiResponse<AssessmentResponse>> updateAssessment(
            @PathVariable final UUID id,
            @Valid @RequestBody final UpdateAssessmentRequest request
    ) {
        log.info("REST request to update assessment ID: {}", id);
        final AssessmentResponse response = assessmentService.updateAssessment(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Assessment updated successfully"));
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publish assessment", description = "Publishes an assessment with questions, enabling it for student attempts")
    public ResponseEntity<ApiResponse<AssessmentResponse>> publishAssessment(@PathVariable final UUID id) {
        log.info("REST request to publish assessment ID: {}", id);
        final AssessmentResponse response = assessmentService.publishAssessment(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Assessment published successfully"));
    }

    @PatchMapping("/{id}/close")
    @Operation(summary = "Close assessment", description = "Closes an assessment")
    public ResponseEntity<ApiResponse<AssessmentResponse>> closeAssessment(@PathVariable final UUID id) {
        log.info("REST request to close assessment ID: {}", id);
        final AssessmentResponse response = assessmentService.closeAssessment(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Assessment closed successfully"));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel assessment", description = "Cancels an assessment")
    public ResponseEntity<ApiResponse<AssessmentResponse>> cancelAssessment(@PathVariable final UUID id) {
        log.info("REST request to cancel assessment ID: {}", id);
        final AssessmentResponse response = assessmentService.cancelAssessment(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Assessment cancelled successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete assessment", description = "Deactivates an assessment by setting active to false")
    public ResponseEntity<ApiResponse<Void>> deleteAssessment(@PathVariable final UUID id) {
        log.info("REST request to delete assessment ID: {}", id);
        assessmentService.deleteAssessment(id);
        return ResponseEntity.ok(ApiResponse.success("Assessment deleted successfully"));
    }
}

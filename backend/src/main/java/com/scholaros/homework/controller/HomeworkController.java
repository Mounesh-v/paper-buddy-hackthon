package com.scholaros.homework.controller;

import com.scholaros.homework.common.ApiResponse;
import com.scholaros.homework.dto.CreateHomeworkRequest;
import com.scholaros.homework.dto.GenerateHomeworkRequest;
import com.scholaros.homework.dto.HomeworkAssignmentResponse;
import com.scholaros.homework.dto.HomeworkFeedbackResponse;
import com.scholaros.homework.dto.HomeworkSubmissionRequest;
import com.scholaros.homework.dto.HomeworkSubmissionResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateHomeworkRequest;
import com.scholaros.homework.entity.HomeworkStatus;
import com.scholaros.homework.service.HomeworkAssignmentService;
import com.scholaros.homework.service.HomeworkFeedbackService;
import com.scholaros.homework.service.HomeworkGeneratorService;
import com.scholaros.homework.service.HomeworkSubmissionService;
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
@RequestMapping(ApiConstants.API_V1_PREFIX + "/homework")
@RequiredArgsConstructor
@Tag(name = "Homework Assignment & Submission Engine", description = "APIs for AI homework generation, assignment lifecycle, submission, and feedback")
public class HomeworkController {

    private final HomeworkGeneratorService generatorService;
    private final HomeworkAssignmentService assignmentService;
    private final HomeworkSubmissionService submissionService;
    private final HomeworkFeedbackService feedbackService;

    @PostMapping("/generate")
    @Operation(summary = "Generate AI homework", description = "Generates a personalized homework assignment from a Homework Recommendation")
    public ResponseEntity<ApiResponse<HomeworkAssignmentResponse>> generateHomework(
            @Valid @RequestBody final GenerateHomeworkRequest request
    ) {
        log.info("REST request to generate homework for recommendation ID: {}", request.getHomeworkRecommendationId());
        final HomeworkAssignmentResponse response = generatorService.generateHomeworkFromRecommendation(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Personalized homework generated successfully"));
    }

    @PostMapping
    @Operation(summary = "Create homework assignment", description = "Manually creates/assigns a homework assignment")
    public ResponseEntity<ApiResponse<HomeworkAssignmentResponse>> createHomework(
            @Valid @RequestBody final CreateHomeworkRequest request
    ) {
        log.info("REST request to create homework assignment: {}", request.getTitle());
        final HomeworkAssignmentResponse response = assignmentService.createHomework(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Homework assignment created successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get homework by ID", description = "Retrieves active homework assignment details by UUID")
    public ResponseEntity<ApiResponse<HomeworkAssignmentResponse>> getHomeworkById(@PathVariable final UUID id) {
        log.info("REST request to get homework assignment ID: {}", id);
        final HomeworkAssignmentResponse response = assignmentService.getHomeworkById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get homework for student", description = "Retrieves paginated homework assignments for a student")
    public ResponseEntity<ApiResponse<PageResponse<HomeworkAssignmentResponse>>> getHomeworkByStudent(
            @PathVariable final UUID studentId,
            @PageableDefault(sort = "dueDate", direction = Sort.Direction.ASC) final Pageable pageable
    ) {
        log.info("REST request to get homework assignments for student ID: {}", studentId);
        final PageResponse<HomeworkAssignmentResponse> page = assignmentService.getHomeworkByStudent(studentId, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get homework assigned by teacher", description = "Retrieves paginated homework assignments created by a teacher")
    public ResponseEntity<ApiResponse<PageResponse<HomeworkAssignmentResponse>>> getHomeworkByTeacher(
            @PathVariable final UUID teacherId,
            @PageableDefault(sort = "assignedDate", direction = Sort.Direction.DESC) final Pageable pageable
    ) {
        log.info("REST request to get homework assignments for teacher ID: {}", teacherId);
        final PageResponse<HomeworkAssignmentResponse> page = assignmentService.getHomeworkByTeacher(teacherId, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/search")
    @Operation(summary = "Search & filter homework assignments", description = "Search homework assignments by student, teacher, lesson session, status, and due date")
    public ResponseEntity<ApiResponse<PageResponse<HomeworkAssignmentResponse>>> searchHomework(
            @RequestParam(required = false) final UUID studentId,
            @RequestParam(required = false) final UUID teacherId,
            @RequestParam(required = false) final UUID lessonSessionId,
            @RequestParam(required = false) final HomeworkStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) final LocalDateTime dueDate,
            @PageableDefault(sort = "dueDate", direction = Sort.Direction.ASC) final Pageable pageable
    ) {
        log.info("REST request to search homework assignments");
        final PageResponse<HomeworkAssignmentResponse> page = assignmentService.searchHomework(studentId, teacherId, lessonSessionId, status, dueDate, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update homework assignment", description = "Updates an existing homework assignment before submission")
    public ResponseEntity<ApiResponse<HomeworkAssignmentResponse>> updateHomework(
            @PathVariable final UUID id,
            @Valid @RequestBody final UpdateHomeworkRequest request
    ) {
        log.info("REST request to update homework assignment ID: {}", id);
        final HomeworkAssignmentResponse response = assignmentService.updateHomework(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Homework assignment updated successfully"));
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publish homework assignment", description = "Publishes a homework assignment to the assigned student")
    public ResponseEntity<ApiResponse<HomeworkAssignmentResponse>> publishHomework(@PathVariable final UUID id) {
        log.info("REST request to publish homework assignment ID: {}", id);
        final HomeworkAssignmentResponse response = assignmentService.publishHomework(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Homework assignment published successfully"));
    }

    @PostMapping("/{id}/submit")
    @Operation(summary = "Submit homework", description = "Submits a homework assignment and triggers automated feedback generation")
    public ResponseEntity<ApiResponse<HomeworkSubmissionResponse>> submitHomework(
            @PathVariable("id") final UUID homeworkAssignmentId,
            @RequestBody(required = false) final HomeworkSubmissionRequest request
    ) {
        log.info("REST request to submit homework ID: {}", homeworkAssignmentId);
        final HomeworkSubmissionResponse response = submissionService.submitHomework(homeworkAssignmentId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Homework submitted and feedback generated successfully"));
    }

    @GetMapping("/{id}/submission")
    @Operation(summary = "Get homework submission", description = "Retrieves submission details for a homework assignment")
    public ResponseEntity<ApiResponse<HomeworkSubmissionResponse>> getSubmissionByHomeworkId(@PathVariable("id") final UUID homeworkAssignmentId) {
        log.info("REST request to get submission for homework ID: {}", homeworkAssignmentId);
        final HomeworkSubmissionResponse response = submissionService.getSubmissionByHomeworkId(homeworkAssignmentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/feedback")
    @Operation(summary = "Get homework feedback", description = "Retrieves feedback details for a submitted homework assignment")
    public ResponseEntity<ApiResponse<HomeworkFeedbackResponse>> getFeedbackByHomeworkId(@PathVariable("id") final UUID homeworkAssignmentId) {
        log.info("REST request to get feedback for homework ID: {}", homeworkAssignmentId);
        final HomeworkFeedbackResponse response = feedbackService.getFeedbackByHomeworkId(homeworkAssignmentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete homework assignment", description = "Deactivates a homework assignment by setting active to false")
    public ResponseEntity<ApiResponse<Void>> deleteHomework(@PathVariable final UUID id) {
        log.info("REST request to delete homework assignment ID: {}", id);
        assignmentService.deleteHomework(id);
        return ResponseEntity.ok(ApiResponse.success("Homework assignment deleted successfully"));
    }
}

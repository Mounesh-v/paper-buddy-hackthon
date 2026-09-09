package com.scholaros.homework.controller;

import com.scholaros.homework.common.ApiResponse;
import com.scholaros.homework.dto.CreateLessonSessionRequest;
import com.scholaros.homework.dto.LessonSearchRequest;
import com.scholaros.homework.dto.LessonSessionResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateLessonSessionRequest;
import com.scholaros.homework.entity.LessonStatus;
import com.scholaros.homework.entity.TeachingMode;
import com.scholaros.homework.service.LessonSessionService;
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

import java.time.LocalDate;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping(ApiConstants.API_V1_PREFIX + "/lessons")
@RequiredArgsConstructor
@Tag(name = "Lesson Management", description = "APIs for creating, updating, searching, and managing teaching lesson sessions")
public class LessonSessionController {

    private final LessonSessionService lessonSessionService;

    @PostMapping
    @Operation(summary = "Create a lesson session", description = "Creates a new lesson session for a completed or planned teaching event")
    public ResponseEntity<ApiResponse<LessonSessionResponse>> createLessonSession(
            @Valid @RequestBody final CreateLessonSessionRequest request
    ) {
        log.info("REST request to create lesson session: {}", request.getLessonTitle());
        final LessonSessionResponse response = lessonSessionService.createLessonSession(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Lesson session created successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get lesson session by ID", description = "Retrieves an active lesson session by its UUID")
    public ResponseEntity<ApiResponse<LessonSessionResponse>> getLessonSessionById(@PathVariable final UUID id) {
        log.info("REST request to get lesson session ID: {}", id);
        final LessonSessionResponse response = lessonSessionService.getLessonSessionById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Get all active lesson sessions", description = "Retrieves paginated active lesson sessions")
    public ResponseEntity<ApiResponse<PageResponse<LessonSessionResponse>>> getAllLessonSessions(
            @PageableDefault(sort = "lessonDate", direction = Sort.Direction.DESC) final Pageable pageable
    ) {
        log.info("REST request to list active lesson sessions");
        final PageResponse<LessonSessionResponse> page = lessonSessionService.getAllLessonSessions(pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/search")
    @Operation(summary = "Search & filter lesson sessions", description = "Search and filter lesson sessions by teacher, school, section, curriculum, chapter, topic, status, teaching mode, and date range")
    public ResponseEntity<ApiResponse<PageResponse<LessonSessionResponse>>> searchLessonSessions(
            @RequestParam(required = false) final UUID teacherId,
            @RequestParam(required = false) final UUID schoolId,
            @RequestParam(required = false) final UUID sectionId,
            @RequestParam(required = false) final UUID curriculumId,
            @RequestParam(required = false) final UUID chapterId,
            @RequestParam(required = false) final UUID topicId,
            @RequestParam(required = false) final LessonStatus status,
            @RequestParam(required = false) final TeachingMode teachingMode,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate lessonDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate endDate,
            @RequestParam(required = false) final String query,
            @PageableDefault(sort = "lessonDate", direction = Sort.Direction.DESC) final Pageable pageable
    ) {
        log.info("REST request to search lesson sessions");
        final LessonSearchRequest searchRequest = LessonSearchRequest.builder()
                .teacherId(teacherId)
                .schoolId(schoolId)
                .sectionId(sectionId)
                .curriculumId(curriculumId)
                .chapterId(chapterId)
                .topicId(topicId)
                .status(status)
                .teachingMode(teachingMode)
                .lessonDate(lessonDate)
                .startDate(startDate)
                .endDate(endDate)
                .query(query)
                .build();

        final PageResponse<LessonSessionResponse> page = lessonSessionService.searchLessonSessions(searchRequest, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update lesson session", description = "Updates an existing active lesson session")
    public ResponseEntity<ApiResponse<LessonSessionResponse>> updateLessonSession(
            @PathVariable final UUID id,
            @Valid @RequestBody final UpdateLessonSessionRequest request
    ) {
        log.info("REST request to update lesson session ID: {}", id);
        final LessonSessionResponse response = lessonSessionService.updateLessonSession(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Lesson session updated successfully"));
    }

    @PatchMapping("/{id}/complete")
    @Operation(summary = "Mark lesson as COMPLETED", description = "Transitions lesson status to COMPLETED, making it eligible for assessment generation")
    public ResponseEntity<ApiResponse<LessonSessionResponse>> completeLesson(@PathVariable final UUID id) {
        log.info("REST request to complete lesson session ID: {}", id);
        final LessonSessionResponse response = lessonSessionService.completeLesson(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lesson marked as COMPLETED successfully"));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Mark lesson as CANCELLED", description = "Transitions lesson status to CANCELLED")
    public ResponseEntity<ApiResponse<LessonSessionResponse>> cancelLesson(@PathVariable final UUID id) {
        log.info("REST request to cancel lesson session ID: {}", id);
        final LessonSessionResponse response = lessonSessionService.cancelLesson(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Lesson marked as CANCELLED successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete lesson session", description = "Deactivates a lesson session by setting active to false")
    public ResponseEntity<ApiResponse<Void>> deleteLessonSession(@PathVariable final UUID id) {
        log.info("REST request to delete lesson session ID: {}", id);
        lessonSessionService.deleteLessonSession(id);
        return ResponseEntity.ok(ApiResponse.success("Lesson session deleted successfully"));
    }
}

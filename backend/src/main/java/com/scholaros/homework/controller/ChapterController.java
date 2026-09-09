package com.scholaros.homework.controller;

import com.scholaros.homework.common.ApiResponse;
import com.scholaros.homework.dto.ChapterResponse;
import com.scholaros.homework.dto.CreateChapterRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateChapterRequest;
import com.scholaros.homework.service.ChapterService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping(ApiConstants.API_V1_PREFIX + "/chapters")
@RequiredArgsConstructor
@Tag(name = "Chapter Management", description = "APIs for managing chapters under a curriculum")
public class ChapterController {

    private final ChapterService chapterService;

    @PostMapping
    @Operation(summary = "Create chapter", description = "Creates a chapter under a curriculum")
    public ResponseEntity<ApiResponse<ChapterResponse>> createChapter(@Valid @RequestBody final CreateChapterRequest request) {
        log.info("REST request to create chapter for curriculumId: {}", request.getCurriculumId());
        final ChapterResponse response = chapterService.createChapter(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Chapter created successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get chapter by ID", description = "Retrieves an active chapter by UUID")
    public ResponseEntity<ApiResponse<ChapterResponse>> getChapterById(@PathVariable final UUID id) {
        log.info("REST request to get chapter by ID: {}", id);
        final ChapterResponse response = chapterService.getChapterById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Get all active chapters / search", description = "Retrieves paginated active chapters with optional title search query or curriculum filter")
    public ResponseEntity<ApiResponse<PageResponse<ChapterResponse>>> getAllChapters(
            @RequestParam(required = false) final String query,
            @RequestParam(required = false) final UUID curriculumId,
            @PageableDefault(sort = "chapterNumber", direction = Sort.Direction.ASC) final Pageable pageable
    ) {
        log.info("REST request to list/search chapters with query: {}, curriculumId: {}", query, curriculumId);
        final PageResponse<ChapterResponse> page;
        if (curriculumId != null) {
            page = chapterService.getChaptersByCurriculum(curriculumId, pageable);
        } else if (query != null && !query.isBlank()) {
            page = chapterService.searchChapters(query, pageable);
        } else {
            page = chapterService.getAllChapters(pageable);
        }
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/curriculum/{curriculumId}")
    @Operation(summary = "Get chapters by Curriculum", description = "Retrieves paginated active chapters for a curriculum")
    public ResponseEntity<ApiResponse<PageResponse<ChapterResponse>>> getChaptersByCurriculum(
            @PathVariable final UUID curriculumId,
            @PageableDefault(sort = "chapterNumber", direction = Sort.Direction.ASC) final Pageable pageable
    ) {
        log.info("REST request to get chapters for curriculumId: {}", curriculumId);
        final PageResponse<ChapterResponse> page = chapterService.getChaptersByCurriculum(curriculumId, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update chapter", description = "Updates an existing active chapter")
    public ResponseEntity<ApiResponse<ChapterResponse>> updateChapter(
            @PathVariable final UUID id,
            @Valid @RequestBody final UpdateChapterRequest request
    ) {
        log.info("REST request to update chapter ID: {}", id);
        final ChapterResponse response = chapterService.updateChapter(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Chapter updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete chapter", description = "Deactivates a chapter by setting active to false")
    public ResponseEntity<ApiResponse<Void>> deleteChapter(@PathVariable final UUID id) {
        log.info("REST request to delete chapter ID: {}", id);
        chapterService.deleteChapter(id);
        return ResponseEntity.ok(ApiResponse.success("Chapter deleted successfully"));
    }
}

package com.scholaros.homework.controller;

import com.scholaros.homework.common.ApiResponse;
import com.scholaros.homework.dto.CreateCurriculumRequest;
import com.scholaros.homework.dto.CurriculumResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateCurriculumRequest;
import com.scholaros.homework.service.CurriculumService;
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
@RequestMapping(ApiConstants.API_V1_PREFIX + "/curricula")
@RequiredArgsConstructor
@Tag(name = "Curriculum Management", description = "APIs for managing curricula (Grade + Subject combinations under a board)")
public class CurriculumController {

    private final CurriculumService curriculumService;

    @PostMapping
    @Operation(summary = "Create curriculum", description = "Creates a curriculum for a board, grade, and subject")
    public ResponseEntity<ApiResponse<CurriculumResponse>> createCurriculum(@Valid @RequestBody final CreateCurriculumRequest request) {
        log.info("REST request to create curriculum for boardId: {}", request.getBoardId());
        final CurriculumResponse response = curriculumService.createCurriculum(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Curriculum created successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get curriculum by ID", description = "Retrieves an active curriculum by UUID")
    public ResponseEntity<ApiResponse<CurriculumResponse>> getCurriculumById(@PathVariable final UUID id) {
        log.info("REST request to get curriculum by ID: {}", id);
        final CurriculumResponse response = curriculumService.getCurriculumById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Get all active curricula / search", description = "Retrieves paginated active curricula with optional search query")
    public ResponseEntity<ApiResponse<PageResponse<CurriculumResponse>>> getAllCurricula(
            @RequestParam(required = false) final String query,
            @PageableDefault(sort = "grade", direction = Sort.Direction.ASC) final Pageable pageable
    ) {
        log.info("REST request to list/search curricula with query: {}", query);
        final PageResponse<CurriculumResponse> page = (query != null && !query.isBlank())
                ? curriculumService.searchCurricula(query, pageable)
                : curriculumService.getAllCurricula(pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/board/{boardId}")
    @Operation(summary = "Get curricula by Board", description = "Retrieves paginated active curricula for a specific board")
    public ResponseEntity<ApiResponse<PageResponse<CurriculumResponse>>> getCurriculaByBoard(
            @PathVariable final UUID boardId,
            @PageableDefault(sort = "grade", direction = Sort.Direction.ASC) final Pageable pageable
    ) {
        log.info("REST request to get curricula for boardId: {}", boardId);
        final PageResponse<CurriculumResponse> page = curriculumService.getCurriculaByBoard(boardId, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update curriculum", description = "Updates an existing active curriculum")
    public ResponseEntity<ApiResponse<CurriculumResponse>> updateCurriculum(
            @PathVariable final UUID id,
            @Valid @RequestBody final UpdateCurriculumRequest request
    ) {
        log.info("REST request to update curriculum ID: {}", id);
        final CurriculumResponse response = curriculumService.updateCurriculum(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Curriculum updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete curriculum", description = "Deactivates a curriculum by setting active to false")
    public ResponseEntity<ApiResponse<Void>> deleteCurriculum(@PathVariable final UUID id) {
        log.info("REST request to delete curriculum ID: {}", id);
        curriculumService.deleteCurriculum(id);
        return ResponseEntity.ok(ApiResponse.success("Curriculum deleted successfully"));
    }
}

package com.scholaros.homework.controller;

import com.scholaros.homework.common.ApiResponse;
import com.scholaros.homework.dto.BoardResponse;
import com.scholaros.homework.dto.CreateBoardRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateBoardRequest;
import com.scholaros.homework.service.BoardService;
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
@RequestMapping(ApiConstants.API_V1_PREFIX + "/boards")
@RequiredArgsConstructor
@Tag(name = "Board Management", description = "APIs for managing education boards (CBSE, ICSE, etc.)")
public class BoardController {

    private final BoardService boardService;

    @PostMapping
    @Operation(summary = "Create a new board", description = "Creates an education board with unique code")
    public ResponseEntity<ApiResponse<BoardResponse>> createBoard(@Valid @RequestBody final CreateBoardRequest request) {
        log.info("REST request to create board: {}", request.getBoardCode());
        final BoardResponse response = boardService.createBoard(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Board created successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get board by ID", description = "Retrieves an active education board by its UUID")
    public ResponseEntity<ApiResponse<BoardResponse>> getBoardById(@PathVariable final UUID id) {
        log.info("REST request to get board by ID: {}", id);
        final BoardResponse response = boardService.getBoardById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Get all active boards / search", description = "Retrieves paginated active boards with optional search query")
    public ResponseEntity<ApiResponse<PageResponse<BoardResponse>>> getAllBoards(
            @RequestParam(required = false) final String query,
            @PageableDefault(sort = "boardName", direction = Sort.Direction.ASC) final Pageable pageable
    ) {
        log.info("REST request to list/search boards with query: {}", query);
        final PageResponse<BoardResponse> page = (query != null && !query.isBlank())
                ? boardService.searchBoards(query, pageable)
                : boardService.getAllBoards(pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update board", description = "Updates an existing active board")
    public ResponseEntity<ApiResponse<BoardResponse>> updateBoard(
            @PathVariable final UUID id,
            @Valid @RequestBody final UpdateBoardRequest request
    ) {
        log.info("REST request to update board ID: {}", id);
        final BoardResponse response = boardService.updateBoard(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Board updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete board", description = "Deactivates a board by setting active to false")
    public ResponseEntity<ApiResponse<Void>> deleteBoard(@PathVariable final UUID id) {
        log.info("REST request to delete board ID: {}", id);
        boardService.deleteBoard(id);
        return ResponseEntity.ok(ApiResponse.success("Board deleted successfully"));
    }
}

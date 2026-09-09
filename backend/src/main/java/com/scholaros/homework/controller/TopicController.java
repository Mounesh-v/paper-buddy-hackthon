package com.scholaros.homework.controller;

import com.scholaros.homework.common.ApiResponse;
import com.scholaros.homework.dto.CreateTopicRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.TopicResponse;
import com.scholaros.homework.dto.UpdateTopicRequest;
import com.scholaros.homework.service.TopicService;
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
@RequestMapping(ApiConstants.API_V1_PREFIX + "/topics")
@RequiredArgsConstructor
@Tag(name = "Topic Management", description = "APIs for managing topics under a chapter")
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    @Operation(summary = "Create topic", description = "Creates a topic under a chapter")
    public ResponseEntity<ApiResponse<TopicResponse>> createTopic(@Valid @RequestBody final CreateTopicRequest request) {
        log.info("REST request to create topic for chapterId: {}", request.getChapterId());
        final TopicResponse response = topicService.createTopic(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Topic created successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get topic by ID", description = "Retrieves an active topic by UUID")
    public ResponseEntity<ApiResponse<TopicResponse>> getTopicById(@PathVariable final UUID id) {
        log.info("REST request to get topic by ID: {}", id);
        final TopicResponse response = topicService.getTopicById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Get all active topics / search", description = "Retrieves paginated active topics with optional search query or chapter filter")
    public ResponseEntity<ApiResponse<PageResponse<TopicResponse>>> getAllTopics(
            @RequestParam(required = false) final String query,
            @RequestParam(required = false) final UUID chapterId,
            @PageableDefault(sort = "displayOrder", direction = Sort.Direction.ASC) final Pageable pageable
    ) {
        log.info("REST request to list/search topics with query: {}, chapterId: {}", query, chapterId);
        final PageResponse<TopicResponse> page;
        if (chapterId != null) {
            page = topicService.getTopicsByChapter(chapterId, pageable);
        } else if (query != null && !query.isBlank()) {
            page = topicService.searchTopics(query, pageable);
        } else {
            page = topicService.getAllTopics(pageable);
        }
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/chapter/{chapterId}")
    @Operation(summary = "Get topics by Chapter", description = "Retrieves paginated active topics for a chapter")
    public ResponseEntity<ApiResponse<PageResponse<TopicResponse>>> getTopicsByChapter(
            @PathVariable final UUID chapterId,
            @PageableDefault(sort = "displayOrder", direction = Sort.Direction.ASC) final Pageable pageable
    ) {
        log.info("REST request to get topics for chapterId: {}", chapterId);
        final PageResponse<TopicResponse> page = topicService.getTopicsByChapter(chapterId, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update topic", description = "Updates an existing active topic")
    public ResponseEntity<ApiResponse<TopicResponse>> updateTopic(
            @PathVariable final UUID id,
            @Valid @RequestBody final UpdateTopicRequest request
    ) {
        log.info("REST request to update topic ID: {}", id);
        final TopicResponse response = topicService.updateTopic(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Topic updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete topic", description = "Deactivates a topic by setting active to false")
    public ResponseEntity<ApiResponse<Void>> deleteTopic(@PathVariable final UUID id) {
        log.info("REST request to delete topic ID: {}", id);
        topicService.deleteTopic(id);
        return ResponseEntity.ok(ApiResponse.success("Topic deleted successfully"));
    }
}

package com.scholaros.homework.controller;

import com.scholaros.homework.common.ApiResponse;
import com.scholaros.homework.dto.CreateOptionRequest;
import com.scholaros.homework.dto.OptionResponse;
import com.scholaros.homework.dto.UpdateOptionRequest;
import com.scholaros.homework.service.QuestionOptionService;
import com.scholaros.homework.util.ApiConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping(ApiConstants.API_V1_PREFIX)
@RequiredArgsConstructor
@Tag(name = "Question Option Management", description = "APIs for managing options of a question")
public class QuestionOptionController {

    private final QuestionOptionService optionService;

    @PostMapping("/questions/{id}/options")
    @Operation(summary = "Add option to question", description = "Adds an answer option to a question")
    public ResponseEntity<ApiResponse<OptionResponse>> addOptionToQuestion(
            @PathVariable("id") final UUID questionId,
            @Valid @RequestBody final CreateOptionRequest request
    ) {
        log.info("REST request to add option to question ID: {}", questionId);
        final OptionResponse response = optionService.addOptionToQuestion(questionId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Option added successfully"));
    }

    @GetMapping("/questions/{id}/options")
    @Operation(summary = "Get options by question", description = "Retrieves all options for a question")
    public ResponseEntity<ApiResponse<List<OptionResponse>>> getOptionsByQuestion(@PathVariable("id") final UUID questionId) {
        log.info("REST request to get options for question ID: {}", questionId);
        final List<OptionResponse> response = optionService.getOptionsByQuestion(questionId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/options/{id}")
    @Operation(summary = "Update option", description = "Updates an option by ID")
    public ResponseEntity<ApiResponse<OptionResponse>> updateOption(
            @PathVariable("id") final UUID optionId,
            @Valid @RequestBody final UpdateOptionRequest request
    ) {
        log.info("REST request to update option ID: {}", optionId);
        final OptionResponse response = optionService.updateOption(optionId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Option updated successfully"));
    }

    @DeleteMapping("/options/{id}")
    @Operation(summary = "Delete option", description = "Deletes an option by ID")
    public ResponseEntity<ApiResponse<Void>> deleteOption(@PathVariable("id") final UUID optionId) {
        log.info("REST request to delete option ID: {}", optionId);
        optionService.deleteOption(optionId);
        return ResponseEntity.ok(ApiResponse.success("Option deleted successfully"));
    }
}

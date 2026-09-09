package com.scholaros.homework.controller;

import com.scholaros.homework.common.ApiResponse;
import com.scholaros.homework.dto.GenerateAnalysisRequest;
import com.scholaros.homework.dto.HomeworkRecommendationResponse;
import com.scholaros.homework.dto.LearningAnalysisResponse;
import com.scholaros.homework.service.HomeworkRecommendationService;
import com.scholaros.homework.service.LearningAnalysisService;
import com.scholaros.homework.util.ApiConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping(ApiConstants.API_V1_PREFIX)
@RequiredArgsConstructor
@Tag(name = "AI Learning Intelligence Engine", description = "APIs for generating structured learning analysis and homework recommendations using AI")
public class LearningAnalysisController {

    private final LearningAnalysisService analysisService;
    private final HomeworkRecommendationService recommendationService;

    @PostMapping("/analysis/generate")
    @Operation(summary = "Generate AI learning analysis", description = "Generates a structured AI learning analysis and homework recommendation for a completed assessment attempt")
    public ResponseEntity<ApiResponse<LearningAnalysisResponse>> generateAnalysis(
            @Valid @RequestBody final GenerateAnalysisRequest request
    ) {
        log.info("REST request to generate AI analysis for attempt ID: {}", request.getAssessmentAttemptId());
        final LearningAnalysisResponse response = analysisService.generateAnalysis(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Learning analysis generated successfully"));
    }

    @GetMapping("/analysis/{attemptId}")
    @Operation(summary = "Get learning analysis by attempt ID", description = "Retrieves the AI learning analysis for an assessment attempt")
    public ResponseEntity<ApiResponse<LearningAnalysisResponse>> getAnalysisByAttemptId(@PathVariable final UUID attemptId) {
        log.info("REST request to get learning analysis for attempt ID: {}", attemptId);
        final LearningAnalysisResponse response = analysisService.getAnalysisByAttemptId(attemptId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/recommendations/{attemptId}")
    @Operation(summary = "Get homework recommendation by attempt ID", description = "Retrieves the homework recommendation derived from AI learning analysis")
    public ResponseEntity<ApiResponse<HomeworkRecommendationResponse>> getRecommendationByAttemptId(@PathVariable final UUID attemptId) {
        log.info("REST request to get homework recommendation for attempt ID: {}", attemptId);
        final HomeworkRecommendationResponse response = recommendationService.getRecommendationByAttemptId(attemptId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get all homework recommendations", description = "Retrieves all available AI homework recommendations")
    public ResponseEntity<ApiResponse<java.util.List<HomeworkRecommendationResponse>>> getAllRecommendations() {
        log.info("REST request to get all homework recommendations");
        final java.util.List<HomeworkRecommendationResponse> response = recommendationService.getAllRecommendations();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

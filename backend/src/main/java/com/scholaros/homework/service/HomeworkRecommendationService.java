package com.scholaros.homework.service;

import com.scholaros.homework.dto.HomeworkRecommendationResponse;

import java.util.List;
import java.util.UUID;

public interface HomeworkRecommendationService {

    HomeworkRecommendationResponse getRecommendationByAttemptId(UUID attemptId);

    HomeworkRecommendationResponse getRecommendationByAnalysisId(UUID analysisId);

    List<HomeworkRecommendationResponse> getAllRecommendations();
}

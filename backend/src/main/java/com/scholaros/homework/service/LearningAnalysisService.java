package com.scholaros.homework.service;

import com.scholaros.homework.dto.GenerateAnalysisRequest;
import com.scholaros.homework.dto.LearningAnalysisResponse;

import java.util.UUID;

public interface LearningAnalysisService {

    LearningAnalysisResponse generateAnalysis(GenerateAnalysisRequest request);

    LearningAnalysisResponse getAnalysisByAttemptId(UUID attemptId);
}

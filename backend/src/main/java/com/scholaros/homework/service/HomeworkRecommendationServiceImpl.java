package com.scholaros.homework.service;

import com.scholaros.homework.dto.HomeworkRecommendationResponse;
import com.scholaros.homework.entity.HomeworkRecommendation;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.HomeworkRecommendationMapper;
import com.scholaros.homework.repository.HomeworkRecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HomeworkRecommendationServiceImpl implements HomeworkRecommendationService {

    private final HomeworkRecommendationRepository recommendationRepository;
    private final HomeworkRecommendationMapper recommendationMapper;

    @Override
    public HomeworkRecommendationResponse getRecommendationByAttemptId(final UUID attemptId) {
        log.debug("Fetching homework recommendation for attempt ID: {}", attemptId);
        final HomeworkRecommendation recommendation = recommendationRepository.findByLearningAnalysisAssessmentAttemptId(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("HomeworkRecommendation", "assessmentAttemptId", attemptId));
        return recommendationMapper.toResponse(recommendation);
    }

    @Override
    public HomeworkRecommendationResponse getRecommendationByAnalysisId(final UUID analysisId) {
        log.debug("Fetching homework recommendation for analysis ID: {}", analysisId);
        final HomeworkRecommendation recommendation = recommendationRepository.findByLearningAnalysisId(analysisId)
                .orElseThrow(() -> new ResourceNotFoundException("HomeworkRecommendation", "learningAnalysisId", analysisId));
        return recommendationMapper.toResponse(recommendation);
    }

    @Override
    public java.util.List<HomeworkRecommendationResponse> getAllRecommendations() {
        log.debug("Fetching all homework recommendations");
        return recommendationRepository.findAll().stream()
                .map(recommendationMapper::toResponse)
                .collect(java.util.stream.Collectors.toList());
    }
}

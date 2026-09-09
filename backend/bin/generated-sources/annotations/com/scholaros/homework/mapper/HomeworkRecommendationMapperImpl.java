package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.HomeworkRecommendationResponse;
import com.scholaros.homework.entity.HomeworkRecommendation;
import com.scholaros.homework.entity.LearningAnalysis;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-08T18:39:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
)
@Component
public class HomeworkRecommendationMapperImpl implements HomeworkRecommendationMapper {

    @Override
    public HomeworkRecommendationResponse toResponse(HomeworkRecommendation recommendation) {
        if ( recommendation == null ) {
            return null;
        }

        HomeworkRecommendationResponse.HomeworkRecommendationResponseBuilder homeworkRecommendationResponse = HomeworkRecommendationResponse.builder();

        homeworkRecommendationResponse.learningAnalysisId( recommendationLearningAnalysisId( recommendation ) );
        homeworkRecommendationResponse.id( recommendation.getId() );
        homeworkRecommendationResponse.priorityLevel( recommendation.getPriorityLevel() );
        homeworkRecommendationResponse.recommendationReason( recommendation.getRecommendationReason() );
        homeworkRecommendationResponse.recommendedDifficulty( recommendation.getRecommendedDifficulty() );
        homeworkRecommendationResponse.recommendedPracticeMinutes( recommendation.getRecommendedPracticeMinutes() );
        homeworkRecommendationResponse.recommendedQuestionCount( recommendation.getRecommendedQuestionCount() );
        homeworkRecommendationResponse.recommendedQuestionTypes( recommendation.getRecommendedQuestionTypes() );
        homeworkRecommendationResponse.recommendedTopics( recommendation.getRecommendedTopics() );

        return homeworkRecommendationResponse.build();
    }

    private UUID recommendationLearningAnalysisId(HomeworkRecommendation homeworkRecommendation) {
        LearningAnalysis learningAnalysis = homeworkRecommendation.getLearningAnalysis();
        if ( learningAnalysis == null ) {
            return null;
        }
        return learningAnalysis.getId();
    }
}

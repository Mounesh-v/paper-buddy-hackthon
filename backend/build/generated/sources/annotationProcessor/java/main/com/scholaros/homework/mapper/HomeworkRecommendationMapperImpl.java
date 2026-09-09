package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.HomeworkRecommendationResponse;
import com.scholaros.homework.entity.HomeworkRecommendation;
import com.scholaros.homework.entity.LearningAnalysis;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-31T07:08:58+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-java-compiler-worker-9.5.1.jar, environment: Java 21.0.12 (Eclipse Adoptium)"
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
        homeworkRecommendationResponse.recommendedDifficulty( recommendation.getRecommendedDifficulty() );
        homeworkRecommendationResponse.recommendedQuestionCount( recommendation.getRecommendedQuestionCount() );
        homeworkRecommendationResponse.recommendedPracticeMinutes( recommendation.getRecommendedPracticeMinutes() );
        homeworkRecommendationResponse.recommendedTopics( recommendation.getRecommendedTopics() );
        homeworkRecommendationResponse.recommendedQuestionTypes( recommendation.getRecommendedQuestionTypes() );
        homeworkRecommendationResponse.priorityLevel( recommendation.getPriorityLevel() );
        homeworkRecommendationResponse.recommendationReason( recommendation.getRecommendationReason() );

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

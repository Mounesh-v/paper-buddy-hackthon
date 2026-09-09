package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.LearningAnalysisResponse;
import com.scholaros.homework.entity.Assessment;
import com.scholaros.homework.entity.AssessmentAttempt;
import com.scholaros.homework.entity.LearningAnalysis;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-08T18:39:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
)
@Component
public class LearningAnalysisMapperImpl implements LearningAnalysisMapper {

    @Autowired
    private HomeworkRecommendationMapper homeworkRecommendationMapper;

    @Override
    public LearningAnalysisResponse toResponse(LearningAnalysis analysis) {
        if ( analysis == null ) {
            return null;
        }

        LearningAnalysisResponse.LearningAnalysisResponseBuilder learningAnalysisResponse = LearningAnalysisResponse.builder();

        learningAnalysisResponse.assessmentAttemptId( analysisAssessmentAttemptId( analysis ) );
        learningAnalysisResponse.assessmentId( analysisAssessmentAttemptAssessmentId( analysis ) );
        learningAnalysisResponse.assessmentTitle( analysisAssessmentAttemptAssessmentTitle( analysis ) );
        learningAnalysisResponse.studentId( analysisAssessmentAttemptStudentId( analysis ) );
        learningAnalysisResponse.aiModel( analysis.getAiModel() );
        learningAnalysisResponse.analysisSummary( analysis.getAnalysisSummary() );
        learningAnalysisResponse.analysisTimestamp( analysis.getAnalysisTimestamp() );
        learningAnalysisResponse.confidenceScore( analysis.getConfidenceScore() );
        learningAnalysisResponse.id( analysis.getId() );
        learningAnalysisResponse.masteryLevel( analysis.getMasteryLevel() );
        learningAnalysisResponse.misconceptions( analysis.getMisconceptions() );
        learningAnalysisResponse.overallMasteryPercentage( analysis.getOverallMasteryPercentage() );
        learningAnalysisResponse.recommendation( homeworkRecommendationMapper.toResponse( analysis.getRecommendation() ) );
        learningAnalysisResponse.recommendedDifficulty( analysis.getRecommendedDifficulty() );
        learningAnalysisResponse.recommendedStudyMinutes( analysis.getRecommendedStudyMinutes() );
        learningAnalysisResponse.strongConcepts( analysis.getStrongConcepts() );
        learningAnalysisResponse.weakConcepts( analysis.getWeakConcepts() );

        return learningAnalysisResponse.build();
    }

    private UUID analysisAssessmentAttemptId(LearningAnalysis learningAnalysis) {
        AssessmentAttempt assessmentAttempt = learningAnalysis.getAssessmentAttempt();
        if ( assessmentAttempt == null ) {
            return null;
        }
        return assessmentAttempt.getId();
    }

    private UUID analysisAssessmentAttemptAssessmentId(LearningAnalysis learningAnalysis) {
        AssessmentAttempt assessmentAttempt = learningAnalysis.getAssessmentAttempt();
        if ( assessmentAttempt == null ) {
            return null;
        }
        Assessment assessment = assessmentAttempt.getAssessment();
        if ( assessment == null ) {
            return null;
        }
        return assessment.getId();
    }

    private String analysisAssessmentAttemptAssessmentTitle(LearningAnalysis learningAnalysis) {
        AssessmentAttempt assessmentAttempt = learningAnalysis.getAssessmentAttempt();
        if ( assessmentAttempt == null ) {
            return null;
        }
        Assessment assessment = assessmentAttempt.getAssessment();
        if ( assessment == null ) {
            return null;
        }
        return assessment.getTitle();
    }

    private UUID analysisAssessmentAttemptStudentId(LearningAnalysis learningAnalysis) {
        AssessmentAttempt assessmentAttempt = learningAnalysis.getAssessmentAttempt();
        if ( assessmentAttempt == null ) {
            return null;
        }
        return assessmentAttempt.getStudentId();
    }
}

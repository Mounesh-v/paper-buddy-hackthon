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
    date = "2026-09-09T16:13:53+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.11 (Eclipse Adoptium)"
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
        learningAnalysisResponse.id( analysis.getId() );
        learningAnalysisResponse.overallMasteryPercentage( analysis.getOverallMasteryPercentage() );
        learningAnalysisResponse.masteryLevel( analysis.getMasteryLevel() );
        learningAnalysisResponse.strongConcepts( analysis.getStrongConcepts() );
        learningAnalysisResponse.weakConcepts( analysis.getWeakConcepts() );
        learningAnalysisResponse.misconceptions( analysis.getMisconceptions() );
        learningAnalysisResponse.confidenceScore( analysis.getConfidenceScore() );
        learningAnalysisResponse.recommendedDifficulty( analysis.getRecommendedDifficulty() );
        learningAnalysisResponse.recommendedStudyMinutes( analysis.getRecommendedStudyMinutes() );
        learningAnalysisResponse.analysisSummary( analysis.getAnalysisSummary() );
        learningAnalysisResponse.aiModel( analysis.getAiModel() );
        learningAnalysisResponse.analysisTimestamp( analysis.getAnalysisTimestamp() );
        learningAnalysisResponse.recommendation( homeworkRecommendationMapper.toResponse( analysis.getRecommendation() ) );

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

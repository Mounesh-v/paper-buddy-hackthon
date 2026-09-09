package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.AssessmentConfigurationRequest;
import com.scholaros.homework.dto.AssessmentConfigurationResponse;
import com.scholaros.homework.entity.Assessment;
import com.scholaros.homework.entity.AssessmentConfiguration;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-09T16:58:41+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class AssessmentConfigurationMapperImpl implements AssessmentConfigurationMapper {

    @Override
    public AssessmentConfiguration toEntity(AssessmentConfigurationRequest request) {
        if ( request == null ) {
            return null;
        }

        AssessmentConfiguration.AssessmentConfigurationBuilder assessmentConfiguration = AssessmentConfiguration.builder();

        assessmentConfiguration.maxAttempts( request.getMaxAttempts() );
        assessmentConfiguration.autoSubmit( request.getAutoSubmit() );
        assessmentConfiguration.randomizeQuestions( request.getRandomizeQuestions() );
        assessmentConfiguration.randomizeOptions( request.getRandomizeOptions() );
        assessmentConfiguration.displayResultImmediately( request.getDisplayResultImmediately() );
        assessmentConfiguration.allowReviewAfterSubmission( request.getAllowReviewAfterSubmission() );
        assessmentConfiguration.allowSkipQuestions( request.getAllowSkipQuestions() );

        return assessmentConfiguration.build();
    }

    @Override
    public AssessmentConfigurationResponse toResponse(AssessmentConfiguration config) {
        if ( config == null ) {
            return null;
        }

        AssessmentConfigurationResponse.AssessmentConfigurationResponseBuilder assessmentConfigurationResponse = AssessmentConfigurationResponse.builder();

        assessmentConfigurationResponse.assessmentId( configAssessmentId( config ) );
        assessmentConfigurationResponse.id( config.getId() );
        assessmentConfigurationResponse.maxAttempts( config.getMaxAttempts() );
        assessmentConfigurationResponse.autoSubmit( config.getAutoSubmit() );
        assessmentConfigurationResponse.randomizeQuestions( config.getRandomizeQuestions() );
        assessmentConfigurationResponse.randomizeOptions( config.getRandomizeOptions() );
        assessmentConfigurationResponse.displayResultImmediately( config.getDisplayResultImmediately() );
        assessmentConfigurationResponse.allowReviewAfterSubmission( config.getAllowReviewAfterSubmission() );
        assessmentConfigurationResponse.allowSkipQuestions( config.getAllowSkipQuestions() );

        return assessmentConfigurationResponse.build();
    }

    @Override
    public void updateEntityFromRequest(AssessmentConfigurationRequest request, AssessmentConfiguration config) {
        if ( request == null ) {
            return;
        }

        if ( request.getMaxAttempts() != null ) {
            config.setMaxAttempts( request.getMaxAttempts() );
        }
        if ( request.getAutoSubmit() != null ) {
            config.setAutoSubmit( request.getAutoSubmit() );
        }
        if ( request.getRandomizeQuestions() != null ) {
            config.setRandomizeQuestions( request.getRandomizeQuestions() );
        }
        if ( request.getRandomizeOptions() != null ) {
            config.setRandomizeOptions( request.getRandomizeOptions() );
        }
        if ( request.getDisplayResultImmediately() != null ) {
            config.setDisplayResultImmediately( request.getDisplayResultImmediately() );
        }
        if ( request.getAllowReviewAfterSubmission() != null ) {
            config.setAllowReviewAfterSubmission( request.getAllowReviewAfterSubmission() );
        }
        if ( request.getAllowSkipQuestions() != null ) {
            config.setAllowSkipQuestions( request.getAllowSkipQuestions() );
        }
    }

    private UUID configAssessmentId(AssessmentConfiguration assessmentConfiguration) {
        Assessment assessment = assessmentConfiguration.getAssessment();
        if ( assessment == null ) {
            return null;
        }
        return assessment.getId();
    }
}

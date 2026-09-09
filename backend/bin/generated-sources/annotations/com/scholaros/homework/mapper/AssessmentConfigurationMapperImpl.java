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
    date = "2026-09-08T18:39:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
)
@Component
public class AssessmentConfigurationMapperImpl implements AssessmentConfigurationMapper {

    @Override
    public AssessmentConfiguration toEntity(AssessmentConfigurationRequest request) {
        if ( request == null ) {
            return null;
        }

        AssessmentConfiguration.AssessmentConfigurationBuilder assessmentConfiguration = AssessmentConfiguration.builder();

        assessmentConfiguration.allowReviewAfterSubmission( request.getAllowReviewAfterSubmission() );
        assessmentConfiguration.allowSkipQuestions( request.getAllowSkipQuestions() );
        assessmentConfiguration.autoSubmit( request.getAutoSubmit() );
        assessmentConfiguration.displayResultImmediately( request.getDisplayResultImmediately() );
        assessmentConfiguration.maxAttempts( request.getMaxAttempts() );
        assessmentConfiguration.randomizeOptions( request.getRandomizeOptions() );
        assessmentConfiguration.randomizeQuestions( request.getRandomizeQuestions() );

        return assessmentConfiguration.build();
    }

    @Override
    public AssessmentConfigurationResponse toResponse(AssessmentConfiguration config) {
        if ( config == null ) {
            return null;
        }

        AssessmentConfigurationResponse.AssessmentConfigurationResponseBuilder assessmentConfigurationResponse = AssessmentConfigurationResponse.builder();

        assessmentConfigurationResponse.assessmentId( configAssessmentId( config ) );
        assessmentConfigurationResponse.allowReviewAfterSubmission( config.getAllowReviewAfterSubmission() );
        assessmentConfigurationResponse.allowSkipQuestions( config.getAllowSkipQuestions() );
        assessmentConfigurationResponse.autoSubmit( config.getAutoSubmit() );
        assessmentConfigurationResponse.displayResultImmediately( config.getDisplayResultImmediately() );
        assessmentConfigurationResponse.id( config.getId() );
        assessmentConfigurationResponse.maxAttempts( config.getMaxAttempts() );
        assessmentConfigurationResponse.randomizeOptions( config.getRandomizeOptions() );
        assessmentConfigurationResponse.randomizeQuestions( config.getRandomizeQuestions() );

        return assessmentConfigurationResponse.build();
    }

    @Override
    public void updateEntityFromRequest(AssessmentConfigurationRequest request, AssessmentConfiguration config) {
        if ( request == null ) {
            return;
        }

        if ( request.getAllowReviewAfterSubmission() != null ) {
            config.setAllowReviewAfterSubmission( request.getAllowReviewAfterSubmission() );
        }
        if ( request.getAllowSkipQuestions() != null ) {
            config.setAllowSkipQuestions( request.getAllowSkipQuestions() );
        }
        if ( request.getAutoSubmit() != null ) {
            config.setAutoSubmit( request.getAutoSubmit() );
        }
        if ( request.getDisplayResultImmediately() != null ) {
            config.setDisplayResultImmediately( request.getDisplayResultImmediately() );
        }
        if ( request.getMaxAttempts() != null ) {
            config.setMaxAttempts( request.getMaxAttempts() );
        }
        if ( request.getRandomizeOptions() != null ) {
            config.setRandomizeOptions( request.getRandomizeOptions() );
        }
        if ( request.getRandomizeQuestions() != null ) {
            config.setRandomizeQuestions( request.getRandomizeQuestions() );
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

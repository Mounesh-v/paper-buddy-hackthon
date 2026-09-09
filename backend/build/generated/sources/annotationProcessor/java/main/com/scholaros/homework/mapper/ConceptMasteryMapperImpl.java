package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.ConceptMasteryResponse;
import com.scholaros.homework.entity.ConceptMastery;
import com.scholaros.homework.entity.LearningRecord;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-31T07:08:58+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-java-compiler-worker-9.5.1.jar, environment: Java 21.0.12 (Eclipse Adoptium)"
)
@Component
public class ConceptMasteryMapperImpl implements ConceptMasteryMapper {

    @Override
    public ConceptMasteryResponse toResponse(ConceptMastery conceptMastery) {
        if ( conceptMastery == null ) {
            return null;
        }

        ConceptMasteryResponse.ConceptMasteryResponseBuilder conceptMasteryResponse = ConceptMasteryResponse.builder();

        conceptMasteryResponse.learningRecordId( conceptMasteryLearningRecordId( conceptMastery ) );
        conceptMasteryResponse.id( conceptMastery.getId() );
        conceptMasteryResponse.conceptName( conceptMastery.getConceptName() );
        conceptMasteryResponse.masteryLevel( conceptMastery.getMasteryLevel() );
        conceptMasteryResponse.masteryPercentage( conceptMastery.getMasteryPercentage() );
        conceptMasteryResponse.attemptCount( conceptMastery.getAttemptCount() );
        conceptMasteryResponse.improvementPercentage( conceptMastery.getImprovementPercentage() );
        conceptMasteryResponse.lastPracticed( conceptMastery.getLastPracticed() );

        return conceptMasteryResponse.build();
    }

    private UUID conceptMasteryLearningRecordId(ConceptMastery conceptMastery) {
        LearningRecord learningRecord = conceptMastery.getLearningRecord();
        if ( learningRecord == null ) {
            return null;
        }
        return learningRecord.getId();
    }
}

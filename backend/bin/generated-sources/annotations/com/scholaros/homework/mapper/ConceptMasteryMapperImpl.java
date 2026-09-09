package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.ConceptMasteryResponse;
import com.scholaros.homework.entity.ConceptMastery;
import com.scholaros.homework.entity.LearningRecord;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-08T18:39:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
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
        conceptMasteryResponse.attemptCount( conceptMastery.getAttemptCount() );
        conceptMasteryResponse.conceptName( conceptMastery.getConceptName() );
        conceptMasteryResponse.id( conceptMastery.getId() );
        conceptMasteryResponse.improvementPercentage( conceptMastery.getImprovementPercentage() );
        conceptMasteryResponse.lastPracticed( conceptMastery.getLastPracticed() );
        conceptMasteryResponse.masteryLevel( conceptMastery.getMasteryLevel() );
        conceptMasteryResponse.masteryPercentage( conceptMastery.getMasteryPercentage() );

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

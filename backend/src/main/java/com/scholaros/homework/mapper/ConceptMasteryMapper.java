package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.ConceptMasteryResponse;
import com.scholaros.homework.entity.ConceptMastery;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = CentralMapperConfig.class)
public interface ConceptMasteryMapper {

    @Mapping(source = "learningRecord.id", target = "learningRecordId")
    ConceptMasteryResponse toResponse(ConceptMastery conceptMastery);
}

package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.AssessmentConfigurationRequest;
import com.scholaros.homework.dto.AssessmentConfigurationResponse;
import com.scholaros.homework.entity.AssessmentConfiguration;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(config = CentralMapperConfig.class)
public interface AssessmentConfigurationMapper {

    @Mapping(target = "assessment", ignore = true)
    AssessmentConfiguration toEntity(AssessmentConfigurationRequest request);

    @Mapping(source = "assessment.id", target = "assessmentId")
    AssessmentConfigurationResponse toResponse(AssessmentConfiguration config);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(AssessmentConfigurationRequest request, @MappingTarget AssessmentConfiguration config);
}

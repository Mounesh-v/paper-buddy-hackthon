package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.AssessmentResponse;
import com.scholaros.homework.dto.AssessmentSummaryResponse;
import com.scholaros.homework.dto.CreateAssessmentRequest;
import com.scholaros.homework.dto.UpdateAssessmentRequest;
import com.scholaros.homework.entity.Assessment;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(config = CentralMapperConfig.class, uses = {AssessmentConfigurationMapper.class, QuestionMapper.class})
public interface AssessmentMapper {

    @Mapping(target = "lessonSession", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "totalMarks", ignore = true)
    @Mapping(target = "configuration", ignore = true)
    @Mapping(target = "questions", ignore = true)
    Assessment toEntity(CreateAssessmentRequest request);

    @Mapping(source = "lessonSession.id", target = "lessonSessionId")
    @Mapping(source = "lessonSession.lessonTitle", target = "lessonTitle")
    AssessmentResponse toResponse(Assessment assessment);

    @Mapping(source = "lessonSession.id", target = "lessonSessionId")
    @Mapping(source = "lessonSession.lessonTitle", target = "lessonTitle")
    AssessmentSummaryResponse toSummaryResponse(Assessment assessment);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "lessonSession", ignore = true)
    @Mapping(target = "configuration", ignore = true)
    void updateEntityFromRequest(UpdateAssessmentRequest request, @MappingTarget Assessment assessment);
}

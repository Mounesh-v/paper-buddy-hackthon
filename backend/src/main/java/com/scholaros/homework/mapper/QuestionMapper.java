package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.CreateQuestionRequest;
import com.scholaros.homework.dto.QuestionResponse;
import com.scholaros.homework.dto.UpdateQuestionRequest;
import com.scholaros.homework.entity.Question;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(config = CentralMapperConfig.class, uses = {QuestionOptionMapper.class})
public interface QuestionMapper {

    @Mapping(target = "assessment", ignore = true)
    @Mapping(target = "options", ignore = true)
    Question toEntity(CreateQuestionRequest request);

    @Mapping(source = "assessment.id", target = "assessmentId")
    QuestionResponse toResponse(Question question);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(UpdateQuestionRequest request, @MappingTarget Question question);
}

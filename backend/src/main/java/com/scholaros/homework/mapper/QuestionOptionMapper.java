package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.CreateOptionRequest;
import com.scholaros.homework.dto.OptionResponse;
import com.scholaros.homework.dto.UpdateOptionRequest;
import com.scholaros.homework.entity.QuestionOption;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(config = CentralMapperConfig.class)
public interface QuestionOptionMapper {

    @Mapping(target = "question", ignore = true)
    QuestionOption toEntity(CreateOptionRequest request);

    @Mapping(source = "question.id", target = "questionId")
    OptionResponse toResponse(QuestionOption option);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(UpdateOptionRequest request, @MappingTarget QuestionOption option);
}

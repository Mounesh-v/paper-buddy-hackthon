package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.SaveAnswerRequest;
import com.scholaros.homework.dto.StudentAnswerResponse;
import com.scholaros.homework.entity.StudentAnswer;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(config = CentralMapperConfig.class)
public interface StudentAnswerMapper {

    @Mapping(target = "attempt", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "correct", ignore = true)
    @Mapping(target = "marksAwarded", ignore = true)
    StudentAnswer toEntity(SaveAnswerRequest request);

    @Mapping(source = "attempt.id", target = "attemptId")
    @Mapping(source = "question.id", target = "questionId")
    @Mapping(source = "question.questionText", target = "questionText")
    StudentAnswerResponse toResponse(StudentAnswer answer);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "attempt", ignore = true)
    @Mapping(target = "question", ignore = true)
    void updateEntityFromRequest(SaveAnswerRequest request, @MappingTarget StudentAnswer answer);
}

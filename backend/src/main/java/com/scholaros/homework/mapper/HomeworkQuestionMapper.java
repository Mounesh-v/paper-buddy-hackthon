package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.HomeworkQuestionResponse;
import com.scholaros.homework.entity.HomeworkQuestion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = CentralMapperConfig.class)
public interface HomeworkQuestionMapper {

    @Mapping(source = "homeworkAssignment.id", target = "homeworkAssignmentId")
    HomeworkQuestionResponse toResponse(HomeworkQuestion question);
}

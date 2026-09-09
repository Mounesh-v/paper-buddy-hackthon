package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.CreateHomeworkRequest;
import com.scholaros.homework.dto.HomeworkAssignmentResponse;
import com.scholaros.homework.dto.UpdateHomeworkRequest;
import com.scholaros.homework.entity.HomeworkAssignment;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(config = CentralMapperConfig.class, uses = {HomeworkQuestionMapper.class, HomeworkSubmissionMapper.class})
public interface HomeworkAssignmentMapper {

    @Mapping(target = "lessonSession", ignore = true)
    @Mapping(target = "homeworkRecommendation", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "questions", ignore = true)
    @Mapping(target = "submission", ignore = true)
    HomeworkAssignment toEntity(CreateHomeworkRequest request);

    @Mapping(source = "lessonSession.id", target = "lessonSessionId")
    @Mapping(source = "lessonSession.lessonTitle", target = "lessonTitle")
    @Mapping(source = "homeworkRecommendation.id", target = "homeworkRecommendationId")
    HomeworkAssignmentResponse toResponse(HomeworkAssignment assignment);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "lessonSession", ignore = true)
    @Mapping(target = "homeworkRecommendation", ignore = true)
    void updateEntityFromRequest(UpdateHomeworkRequest request, @MappingTarget HomeworkAssignment assignment);
}

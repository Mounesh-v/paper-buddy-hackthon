package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.HomeworkSubmissionResponse;
import com.scholaros.homework.entity.HomeworkSubmission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = CentralMapperConfig.class, uses = {HomeworkFeedbackMapper.class})
public interface HomeworkSubmissionMapper {

    @Mapping(source = "homeworkAssignment.id", target = "homeworkAssignmentId")
    HomeworkSubmissionResponse toResponse(HomeworkSubmission submission);
}

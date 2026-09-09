package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.HomeworkFeedbackResponse;
import com.scholaros.homework.entity.HomeworkFeedback;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = CentralMapperConfig.class)
public interface HomeworkFeedbackMapper {

    @Mapping(source = "homeworkSubmission.id", target = "homeworkSubmissionId")
    HomeworkFeedbackResponse toResponse(HomeworkFeedback feedback);
}

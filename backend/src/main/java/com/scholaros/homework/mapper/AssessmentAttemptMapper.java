package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.AssessmentAttemptResponse;
import com.scholaros.homework.dto.AssessmentResultResponse;
import com.scholaros.homework.entity.AssessmentAttempt;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = CentralMapperConfig.class, uses = {StudentAnswerMapper.class})
public interface AssessmentAttemptMapper {

    @Mapping(source = "assessment.id", target = "assessmentId")
    @Mapping(source = "assessment.title", target = "assessmentTitle")
    AssessmentAttemptResponse toResponse(AssessmentAttempt attempt);

    @Mapping(source = "id", target = "attemptId")
    @Mapping(source = "assessment.id", target = "assessmentId")
    @Mapping(source = "assessment.title", target = "assessmentTitle")
    @Mapping(source = "assessment.passingMarks", target = "passingMarks")
    @Mapping(target = "totalQuestions", ignore = true)
    @Mapping(target = "totalAttempted", ignore = true)
    @Mapping(target = "totalCorrect", ignore = true)
    AssessmentResultResponse toResultResponse(AssessmentAttempt attempt);
}

package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.LearningAnalysisResponse;
import com.scholaros.homework.entity.LearningAnalysis;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = CentralMapperConfig.class, uses = {HomeworkRecommendationMapper.class})
public interface LearningAnalysisMapper {

    @Mapping(source = "assessmentAttempt.id", target = "assessmentAttemptId")
    @Mapping(source = "assessmentAttempt.assessment.id", target = "assessmentId")
    @Mapping(source = "assessmentAttempt.assessment.title", target = "assessmentTitle")
    @Mapping(source = "assessmentAttempt.studentId", target = "studentId")
    LearningAnalysisResponse toResponse(LearningAnalysis analysis);
}

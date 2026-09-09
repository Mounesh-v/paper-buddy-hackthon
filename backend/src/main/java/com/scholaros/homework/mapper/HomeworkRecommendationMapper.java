package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.HomeworkRecommendationResponse;
import com.scholaros.homework.entity.HomeworkRecommendation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = CentralMapperConfig.class)
public interface HomeworkRecommendationMapper {

    @Mapping(source = "learningAnalysis.id", target = "learningAnalysisId")
    HomeworkRecommendationResponse toResponse(HomeworkRecommendation recommendation);
}

package com.scholaros.homework.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholaros.homework.dto.TeacherInsightResponse;
import com.scholaros.homework.entity.TeacherInsight;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.List;

@Mapper(config = CentralMapperConfig.class)
public abstract class TeacherInsightMapper {

    @Mapping(source = "curriculum.id", target = "curriculumId")
    @Mapping(source = "strongTopics", target = "strongTopics", qualifiedByName = "jsonToList")
    @Mapping(source = "weakTopics", target = "weakTopics", qualifiedByName = "jsonToList")
    @Mapping(source = "recommendedRevisionTopics", target = "recommendedRevisionTopics", qualifiedByName = "jsonToList")
    public abstract TeacherInsightResponse toResponse(TeacherInsight insight);

    @Named("jsonToList")
    protected List<String> jsonToList(final String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return new ObjectMapper().readValue(json, new TypeReference<List<String>>() {});
        } catch (final JsonProcessingException e) {
            return Collections.singletonList(json);
        }
    }
}

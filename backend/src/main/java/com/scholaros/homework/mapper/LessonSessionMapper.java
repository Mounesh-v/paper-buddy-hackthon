package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.CreateLessonSessionRequest;
import com.scholaros.homework.dto.LessonSessionResponse;
import com.scholaros.homework.dto.LessonSummaryResponse;
import com.scholaros.homework.dto.UpdateLessonSessionRequest;
import com.scholaros.homework.entity.LessonSession;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(config = CentralMapperConfig.class)
public interface LessonSessionMapper {

    @Mapping(target = "curriculum", ignore = true)
    @Mapping(target = "chapter", ignore = true)
    @Mapping(target = "topic", ignore = true)
    @Mapping(target = "status", ignore = true)
    LessonSession toEntity(CreateLessonSessionRequest request);

    @Mapping(source = "curriculum.id", target = "curriculumId")
    @Mapping(source = "curriculum.grade", target = "grade")
    @Mapping(source = "curriculum.subject", target = "subject")
    @Mapping(source = "chapter.id", target = "chapterId")
    @Mapping(source = "chapter.chapterNumber", target = "chapterNumber")
    @Mapping(source = "chapter.title", target = "chapterTitle")
    @Mapping(source = "topic.id", target = "topicId")
    @Mapping(source = "topic.topicName", target = "topicName")
    LessonSessionResponse toResponse(LessonSession lessonSession);

    @Mapping(source = "chapter.title", target = "chapterTitle")
    @Mapping(source = "topic.topicName", target = "topicName")
    LessonSummaryResponse toSummaryResponse(LessonSession lessonSession);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "curriculum", ignore = true)
    @Mapping(target = "chapter", ignore = true)
    @Mapping(target = "topic", ignore = true)
    void updateEntityFromRequest(UpdateLessonSessionRequest request, @MappingTarget LessonSession lessonSession);
}

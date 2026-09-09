package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.LearningRecordResponse;
import com.scholaros.homework.entity.LearningRecord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = CentralMapperConfig.class, uses = {ConceptMasteryMapper.class})
public interface LearningRecordMapper {

    @Mapping(source = "curriculum.id", target = "curriculumId")
    @Mapping(source = "chapter.id", target = "chapterId")
    @Mapping(source = "chapter.title", target = "chapterTitle")
    @Mapping(source = "topic.id", target = "topicId")
    @Mapping(source = "topic.topicName", target = "topicName")
    LearningRecordResponse toResponse(LearningRecord record);
}

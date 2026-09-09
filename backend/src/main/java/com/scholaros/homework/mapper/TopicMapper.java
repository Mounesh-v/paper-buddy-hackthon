package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.CreateTopicRequest;
import com.scholaros.homework.dto.TopicResponse;
import com.scholaros.homework.dto.UpdateTopicRequest;
import com.scholaros.homework.entity.Topic;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(config = CentralMapperConfig.class)
public interface TopicMapper {

    @Mapping(target = "chapter", ignore = true)
    Topic toEntity(CreateTopicRequest request);

    @Mapping(source = "chapter.id", target = "chapterId")
    @Mapping(source = "chapter.chapterNumber", target = "chapterNumber")
    @Mapping(source = "chapter.title", target = "chapterTitle")
    TopicResponse toResponse(Topic topic);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(UpdateTopicRequest request, @MappingTarget Topic topic);
}

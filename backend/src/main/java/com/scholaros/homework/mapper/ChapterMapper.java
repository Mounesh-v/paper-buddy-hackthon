package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.ChapterResponse;
import com.scholaros.homework.dto.CreateChapterRequest;
import com.scholaros.homework.dto.UpdateChapterRequest;
import com.scholaros.homework.entity.Chapter;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(config = CentralMapperConfig.class)
public interface ChapterMapper {

    @Mapping(target = "curriculum", ignore = true)
    Chapter toEntity(CreateChapterRequest request);

    @Mapping(source = "curriculum.id", target = "curriculumId")
    @Mapping(source = "curriculum.grade", target = "grade")
    @Mapping(source = "curriculum.subject", target = "subject")
    ChapterResponse toResponse(Chapter chapter);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(UpdateChapterRequest request, @MappingTarget Chapter chapter);
}

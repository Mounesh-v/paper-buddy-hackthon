package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.CreateCurriculumRequest;
import com.scholaros.homework.dto.CurriculumResponse;
import com.scholaros.homework.dto.UpdateCurriculumRequest;
import com.scholaros.homework.entity.Curriculum;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(config = CentralMapperConfig.class)
public interface CurriculumMapper {

    @Mapping(target = "board", ignore = true)
    Curriculum toEntity(CreateCurriculumRequest request);

    @Mapping(source = "board.id", target = "boardId")
    @Mapping(source = "board.boardCode", target = "boardCode")
    @Mapping(source = "board.boardName", target = "boardName")
    CurriculumResponse toResponse(Curriculum curriculum);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(UpdateCurriculumRequest request, @MappingTarget Curriculum curriculum);
}

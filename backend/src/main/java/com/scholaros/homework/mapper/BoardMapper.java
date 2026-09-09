package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.BoardResponse;
import com.scholaros.homework.dto.CreateBoardRequest;
import com.scholaros.homework.dto.UpdateBoardRequest;
import com.scholaros.homework.entity.Board;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(config = CentralMapperConfig.class)
public interface BoardMapper {

    Board toEntity(CreateBoardRequest request);

    BoardResponse toResponse(Board board);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(UpdateBoardRequest request, @MappingTarget Board board);
}

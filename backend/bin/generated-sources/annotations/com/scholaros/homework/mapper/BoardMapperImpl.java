package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.BoardResponse;
import com.scholaros.homework.dto.CreateBoardRequest;
import com.scholaros.homework.dto.UpdateBoardRequest;
import com.scholaros.homework.entity.Board;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-08T18:39:37+0530",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.100.v20260826-1225, environment: Java 21.0.12.1 (Eclipse Adoptium)"
)
@Component
public class BoardMapperImpl implements BoardMapper {

    @Override
    public Board toEntity(CreateBoardRequest request) {
        if ( request == null ) {
            return null;
        }

        Board.BoardBuilder board = Board.builder();

        board.boardCode( request.getBoardCode() );
        board.boardName( request.getBoardName() );
        board.description( request.getDescription() );

        return board.build();
    }

    @Override
    public BoardResponse toResponse(Board board) {
        if ( board == null ) {
            return null;
        }

        BoardResponse.BoardResponseBuilder boardResponse = BoardResponse.builder();

        boardResponse.active( board.getActive() );
        boardResponse.boardCode( board.getBoardCode() );
        boardResponse.boardName( board.getBoardName() );
        boardResponse.createdAt( board.getCreatedAt() );
        boardResponse.description( board.getDescription() );
        boardResponse.id( board.getId() );
        boardResponse.updatedAt( board.getUpdatedAt() );

        return boardResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateBoardRequest request, Board board) {
        if ( request == null ) {
            return;
        }

        if ( request.getActive() != null ) {
            board.setActive( request.getActive() );
        }
        if ( request.getBoardCode() != null ) {
            board.setBoardCode( request.getBoardCode() );
        }
        if ( request.getBoardName() != null ) {
            board.setBoardName( request.getBoardName() );
        }
        if ( request.getDescription() != null ) {
            board.setDescription( request.getDescription() );
        }
    }
}

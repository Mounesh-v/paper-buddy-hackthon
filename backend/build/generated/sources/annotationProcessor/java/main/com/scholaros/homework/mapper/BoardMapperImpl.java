package com.scholaros.homework.mapper;

import com.scholaros.homework.dto.BoardResponse;
import com.scholaros.homework.dto.CreateBoardRequest;
import com.scholaros.homework.dto.UpdateBoardRequest;
import com.scholaros.homework.entity.Board;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-31T07:08:58+0530",
    comments = "version: 1.6.3, compiler: IncrementalProcessingEnvironment from gradle-java-compiler-worker-9.5.1.jar, environment: Java 21.0.12 (Eclipse Adoptium)"
)
@Component
public class BoardMapperImpl implements BoardMapper {

    @Override
    public Board toEntity(CreateBoardRequest request) {
        if ( request == null ) {
            return null;
        }

        Board.BoardBuilder board = Board.builder();

        board.boardName( request.getBoardName() );
        board.boardCode( request.getBoardCode() );
        board.description( request.getDescription() );

        return board.build();
    }

    @Override
    public BoardResponse toResponse(Board board) {
        if ( board == null ) {
            return null;
        }

        BoardResponse.BoardResponseBuilder boardResponse = BoardResponse.builder();

        boardResponse.id( board.getId() );
        boardResponse.boardName( board.getBoardName() );
        boardResponse.boardCode( board.getBoardCode() );
        boardResponse.description( board.getDescription() );
        boardResponse.active( board.getActive() );
        boardResponse.createdAt( board.getCreatedAt() );
        boardResponse.updatedAt( board.getUpdatedAt() );

        return boardResponse.build();
    }

    @Override
    public void updateEntityFromRequest(UpdateBoardRequest request, Board board) {
        if ( request == null ) {
            return;
        }

        if ( request.getBoardName() != null ) {
            board.setBoardName( request.getBoardName() );
        }
        if ( request.getBoardCode() != null ) {
            board.setBoardCode( request.getBoardCode() );
        }
        if ( request.getDescription() != null ) {
            board.setDescription( request.getDescription() );
        }
        if ( request.getActive() != null ) {
            board.setActive( request.getActive() );
        }
    }
}

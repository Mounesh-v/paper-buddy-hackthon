package com.scholaros.homework.service;

import com.scholaros.homework.dto.BoardResponse;
import com.scholaros.homework.dto.CreateBoardRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateBoardRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface BoardService {

    BoardResponse createBoard(CreateBoardRequest request);

    BoardResponse getBoardById(UUID id);

    PageResponse<BoardResponse> getAllBoards(Pageable pageable);

    PageResponse<BoardResponse> searchBoards(String query, Pageable pageable);

    BoardResponse updateBoard(UUID id, UpdateBoardRequest request);

    void deleteBoard(UUID id);
}

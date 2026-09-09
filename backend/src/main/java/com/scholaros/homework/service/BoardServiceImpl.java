package com.scholaros.homework.service;

import com.scholaros.homework.dto.BoardResponse;
import com.scholaros.homework.dto.CreateBoardRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateBoardRequest;
import com.scholaros.homework.entity.Board;
import com.scholaros.homework.exception.DuplicateResourceException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.BoardMapper;
import com.scholaros.homework.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final BoardMapper boardMapper;

    @Override
    @Transactional
    public BoardResponse createBoard(final CreateBoardRequest request) {
        log.info("Creating board with code: {}", request.getBoardCode());
        if (boardRepository.existsByBoardCode(request.getBoardCode())) {
            throw new DuplicateResourceException("Board", "boardCode", request.getBoardCode());
        }

        final Board board = boardMapper.toEntity(request);
        if (board.getActive() == null) {
            board.setActive(true);
        }
        final Board savedBoard = boardRepository.save(board);
        log.info("Board created successfully with ID: {}", savedBoard.getId());
        return boardMapper.toResponse(savedBoard);
    }

    @Override
    public BoardResponse getBoardById(final UUID id) {
        log.debug("Fetching board by ID: {}", id);
        final Board board = boardRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", id));
        return boardMapper.toResponse(board);
    }

    @Override
    public PageResponse<BoardResponse> getAllBoards(final Pageable pageable) {
        log.debug("Fetching all active boards, page: {}", pageable.getPageNumber());
        final Page<BoardResponse> page = boardRepository.findByActiveTrue(pageable)
                .map(boardMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    public PageResponse<BoardResponse> searchBoards(final String query, final Pageable pageable) {
        log.debug("Searching active boards with query: {}", query);
        if (query == null || query.isBlank()) {
            return getAllBoards(pageable);
        }
        final String searchTerm = query.trim();
        final Page<BoardResponse> page = boardRepository
                .findByBoardNameContainingIgnoreCaseOrBoardCodeContainingIgnoreCaseAndActiveTrue(searchTerm, searchTerm, pageable)
                .map(boardMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional
    public BoardResponse updateBoard(final UUID id, final UpdateBoardRequest request) {
        log.info("Updating board with ID: {}", id);
        final Board board = boardRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", id));

        if (request.getBoardCode() != null && !request.getBoardCode().isBlank()) {
            if (boardRepository.existsByBoardCodeAndIdNot(request.getBoardCode(), id)) {
                throw new DuplicateResourceException("Board", "boardCode", request.getBoardCode());
            }
        }

        boardMapper.updateEntityFromRequest(request, board);
        final Board updatedBoard = boardRepository.save(board);
        log.info("Board updated successfully with ID: {}", updatedBoard.getId());
        return boardMapper.toResponse(updatedBoard);
    }

    @Override
    @Transactional
    public void deleteBoard(final UUID id) {
        log.info("Soft deleting board with ID: {}", id);
        final Board board = boardRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", id));
        board.setActive(false);
        boardRepository.save(board);
        log.info("Board soft deleted with ID: {}", id);
    }
}

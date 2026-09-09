package com.scholaros.homework.service;

import com.scholaros.homework.dto.CreateCurriculumRequest;
import com.scholaros.homework.dto.CurriculumResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateCurriculumRequest;
import com.scholaros.homework.entity.Board;
import com.scholaros.homework.entity.Curriculum;
import com.scholaros.homework.exception.DuplicateResourceException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.CurriculumMapper;
import com.scholaros.homework.repository.BoardRepository;
import com.scholaros.homework.repository.CurriculumRepository;
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
public class CurriculumServiceImpl implements CurriculumService {

    private final CurriculumRepository curriculumRepository;
    private final BoardRepository boardRepository;
    private final CurriculumMapper curriculumMapper;

    @Override
    @Transactional
    public CurriculumResponse createCurriculum(final CreateCurriculumRequest request) {
        log.info("Creating curriculum for boardId: {}, grade: {}, subject: {}",
                request.getBoardId(), request.getGrade(), request.getSubject());

        final Board board = boardRepository.findByIdAndActiveTrue(request.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board", "id", request.getBoardId()));

        if (curriculumRepository.existsByBoardIdAndGradeIgnoreCaseAndSubjectIgnoreCase(
                request.getBoardId(), request.getGrade(), request.getSubject())) {
            throw new DuplicateResourceException("Curriculum with grade '" + request.getGrade()
                    + "' and subject '" + request.getSubject() + "' already exists for this board");
        }

        final Curriculum curriculum = curriculumMapper.toEntity(request);
        curriculum.setBoard(board);
        if (curriculum.getActive() == null) {
            curriculum.setActive(true);
        }

        final Curriculum saved = curriculumRepository.save(curriculum);
        log.info("Curriculum created successfully with ID: {}", saved.getId());
        return curriculumMapper.toResponse(saved);
    }

    @Override
    public CurriculumResponse getCurriculumById(final UUID id) {
        log.debug("Fetching curriculum by ID: {}", id);
        final Curriculum curriculum = curriculumRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curriculum", "id", id));
        return curriculumMapper.toResponse(curriculum);
    }

    @Override
    public PageResponse<CurriculumResponse> getAllCurricula(final Pageable pageable) {
        log.debug("Fetching all active curricula");
        final Page<CurriculumResponse> page = curriculumRepository.findByActiveTrue(pageable)
                .map(curriculumMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    public PageResponse<CurriculumResponse> getCurriculaByBoard(final UUID boardId, final Pageable pageable) {
        log.debug("Fetching active curricula for boardId: {}", boardId);
        if (!boardRepository.existsById(boardId)) {
            throw new ResourceNotFoundException("Board", "id", boardId);
        }
        final Page<CurriculumResponse> page = curriculumRepository.findByBoardIdAndActiveTrue(boardId, pageable)
                .map(curriculumMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    public PageResponse<CurriculumResponse> searchCurricula(final String query, final Pageable pageable) {
        log.debug("Searching active curricula with query: {}", query);
        if (query == null || query.isBlank()) {
            return getAllCurricula(pageable);
        }
        final String searchTerm = query.trim();
        final Page<CurriculumResponse> page = curriculumRepository
                .findByGradeContainingIgnoreCaseOrSubjectContainingIgnoreCaseAndActiveTrue(searchTerm, searchTerm, pageable)
                .map(curriculumMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional
    public CurriculumResponse updateCurriculum(final UUID id, final UpdateCurriculumRequest request) {
        log.info("Updating curriculum with ID: {}", id);
        final Curriculum curriculum = curriculumRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curriculum", "id", id));

        final String updatedGrade = request.getGrade() != null ? request.getGrade() : curriculum.getGrade();
        final String updatedSubject = request.getSubject() != null ? request.getSubject() : curriculum.getSubject();

        if (curriculumRepository.existsByBoardIdAndGradeIgnoreCaseAndSubjectIgnoreCaseAndIdNot(
                curriculum.getBoard().getId(), updatedGrade, updatedSubject, id)) {
            throw new DuplicateResourceException("Curriculum with grade '" + updatedGrade
                    + "' and subject '" + updatedSubject + "' already exists for this board");
        }

        curriculumMapper.updateEntityFromRequest(request, curriculum);
        final Curriculum updated = curriculumRepository.save(curriculum);
        log.info("Curriculum updated successfully with ID: {}", updated.getId());
        return curriculumMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCurriculum(final UUID id) {
        log.info("Soft deleting curriculum with ID: {}", id);
        final Curriculum curriculum = curriculumRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curriculum", "id", id));
        curriculum.setActive(false);
        curriculumRepository.save(curriculum);
        log.info("Curriculum soft deleted with ID: {}", id);
    }
}

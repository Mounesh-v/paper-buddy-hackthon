package com.scholaros.homework.service;

import com.scholaros.homework.dto.ChapterResponse;
import com.scholaros.homework.dto.CreateChapterRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateChapterRequest;
import com.scholaros.homework.entity.Chapter;
import com.scholaros.homework.entity.Curriculum;
import com.scholaros.homework.exception.DuplicateResourceException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.ChapterMapper;
import com.scholaros.homework.repository.ChapterRepository;
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
public class ChapterServiceImpl implements ChapterService {

    private final ChapterRepository chapterRepository;
    private final CurriculumRepository curriculumRepository;
    private final ChapterMapper chapterMapper;

    @Override
    @Transactional
    public ChapterResponse createChapter(final CreateChapterRequest request) {
        log.info("Creating chapter for curriculumId: {}, chapterNumber: {}, title: {}",
                request.getCurriculumId(), request.getChapterNumber(), request.getTitle());

        final Curriculum curriculum = curriculumRepository.findByIdAndActiveTrue(request.getCurriculumId())
                .orElseThrow(() -> new ResourceNotFoundException("Curriculum", "id", request.getCurriculumId()));

        if (chapterRepository.existsByCurriculumIdAndChapterNumber(request.getCurriculumId(), request.getChapterNumber())) {
            throw new DuplicateResourceException("Chapter number " + request.getChapterNumber() + " already exists in this curriculum");
        }

        final Chapter chapter = chapterMapper.toEntity(request);
        chapter.setCurriculum(curriculum);
        if (chapter.getActive() == null) {
            chapter.setActive(true);
        }

        final Chapter saved = chapterRepository.save(chapter);
        log.info("Chapter created successfully with ID: {}", saved.getId());
        return chapterMapper.toResponse(saved);
    }

    @Override
    public ChapterResponse getChapterById(final UUID id) {
        log.debug("Fetching chapter by ID: {}", id);
        final Chapter chapter = chapterRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", id));
        return chapterMapper.toResponse(chapter);
    }

    @Override
    public PageResponse<ChapterResponse> getAllChapters(final Pageable pageable) {
        log.debug("Fetching all active chapters");
        final Page<ChapterResponse> page = chapterRepository.findByActiveTrue(pageable)
                .map(chapterMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    public PageResponse<ChapterResponse> getChaptersByCurriculum(final UUID curriculumId, final Pageable pageable) {
        log.debug("Fetching active chapters for curriculumId: {}", curriculumId);
        if (!curriculumRepository.existsById(curriculumId)) {
            throw new ResourceNotFoundException("Curriculum", "id", curriculumId);
        }
        final Page<ChapterResponse> page = chapterRepository.findByCurriculumIdAndActiveTrue(curriculumId, pageable)
                .map(chapterMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    public PageResponse<ChapterResponse> searchChapters(final String query, final Pageable pageable) {
        log.debug("Searching active chapters with query: {}", query);
        if (query == null || query.isBlank()) {
            return getAllChapters(pageable);
        }
        final Page<ChapterResponse> page = chapterRepository
                .findByTitleContainingIgnoreCaseAndActiveTrue(query.trim(), pageable)
                .map(chapterMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional
    public ChapterResponse updateChapter(final UUID id, final UpdateChapterRequest request) {
        log.info("Updating chapter with ID: {}", id);
        final Chapter chapter = chapterRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", id));

        if (request.getChapterNumber() != null) {
            if (chapterRepository.existsByCurriculumIdAndChapterNumberAndIdNot(
                    chapter.getCurriculum().getId(), request.getChapterNumber(), id)) {
                throw new DuplicateResourceException("Chapter number " + request.getChapterNumber() + " already exists in this curriculum");
            }
        }

        chapterMapper.updateEntityFromRequest(request, chapter);
        final Chapter updated = chapterRepository.save(chapter);
        log.info("Chapter updated successfully with ID: {}", updated.getId());
        return chapterMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteChapter(final UUID id) {
        log.info("Soft deleting chapter with ID: {}", id);
        final Chapter chapter = chapterRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", id));
        chapter.setActive(false);
        chapterRepository.save(chapter);
        log.info("Chapter soft deleted with ID: {}", id);
    }
}

package com.scholaros.homework.service;

import com.scholaros.homework.dto.ChapterResponse;
import com.scholaros.homework.dto.CreateChapterRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateChapterRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ChapterService {

    ChapterResponse createChapter(CreateChapterRequest request);

    ChapterResponse getChapterById(UUID id);

    PageResponse<ChapterResponse> getAllChapters(Pageable pageable);

    PageResponse<ChapterResponse> getChaptersByCurriculum(UUID curriculumId, Pageable pageable);

    PageResponse<ChapterResponse> searchChapters(String query, Pageable pageable);

    ChapterResponse updateChapter(UUID id, UpdateChapterRequest request);

    void deleteChapter(UUID id);
}

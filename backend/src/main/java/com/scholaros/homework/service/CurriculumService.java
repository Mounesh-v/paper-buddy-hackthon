package com.scholaros.homework.service;

import com.scholaros.homework.dto.CreateCurriculumRequest;
import com.scholaros.homework.dto.CurriculumResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateCurriculumRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CurriculumService {

    CurriculumResponse createCurriculum(CreateCurriculumRequest request);

    CurriculumResponse getCurriculumById(UUID id);

    PageResponse<CurriculumResponse> getAllCurricula(Pageable pageable);

    PageResponse<CurriculumResponse> getCurriculaByBoard(UUID boardId, Pageable pageable);

    PageResponse<CurriculumResponse> searchCurricula(String query, Pageable pageable);

    CurriculumResponse updateCurriculum(UUID id, UpdateCurriculumRequest request);

    void deleteCurriculum(UUID id);
}

package com.scholaros.homework.service;

import com.scholaros.homework.dto.CreateLessonSessionRequest;
import com.scholaros.homework.dto.LessonSearchRequest;
import com.scholaros.homework.dto.LessonSessionResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateLessonSessionRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface LessonSessionService {

    LessonSessionResponse createLessonSession(CreateLessonSessionRequest request);

    LessonSessionResponse getLessonSessionById(UUID id);

    PageResponse<LessonSessionResponse> getAllLessonSessions(Pageable pageable);

    PageResponse<LessonSessionResponse> searchLessonSessions(LessonSearchRequest searchRequest, Pageable pageable);

    LessonSessionResponse updateLessonSession(UUID id, UpdateLessonSessionRequest request);

    LessonSessionResponse completeLesson(UUID id);

    LessonSessionResponse cancelLesson(UUID id);

    void deleteLessonSession(UUID id);
}

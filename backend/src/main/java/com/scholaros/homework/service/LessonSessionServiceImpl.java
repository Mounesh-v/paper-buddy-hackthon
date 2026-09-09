package com.scholaros.homework.service;

import com.scholaros.homework.dto.CreateLessonSessionRequest;
import com.scholaros.homework.dto.LessonSearchRequest;
import com.scholaros.homework.dto.LessonSessionResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.UpdateLessonSessionRequest;
import com.scholaros.homework.entity.Chapter;
import com.scholaros.homework.entity.Curriculum;
import com.scholaros.homework.entity.LessonSession;
import com.scholaros.homework.entity.LessonStatus;
import com.scholaros.homework.entity.TeachingMode;
import com.scholaros.homework.entity.Topic;
import com.scholaros.homework.exception.BadRequestException;
import com.scholaros.homework.exception.ResourceNotFoundException;
import com.scholaros.homework.mapper.LessonSessionMapper;
import com.scholaros.homework.repository.ChapterRepository;
import com.scholaros.homework.repository.CurriculumRepository;
import com.scholaros.homework.repository.LessonSessionRepository;
import com.scholaros.homework.repository.LessonSessionSpecification;
import com.scholaros.homework.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LessonSessionServiceImpl implements LessonSessionService {

    private final LessonSessionRepository lessonSessionRepository;
    private final CurriculumRepository curriculumRepository;
    private final ChapterRepository chapterRepository;
    private final TopicRepository topicRepository;
    private final LessonSessionMapper lessonSessionMapper;

    @Override
    @Transactional
    public LessonSessionResponse createLessonSession(final CreateLessonSessionRequest request) {
        log.info("Creating lesson session for teacherId: {}, sectionId: {}, topicId: {}",
                request.getTeacherId(), request.getSectionId(), request.getTopicId());

        validateTimes(request.getStartTime(), request.getEndTime(), request.getEstimatedDurationMinutes());

        final Curriculum curriculum = curriculumRepository.findByIdAndActiveTrue(request.getCurriculumId())
                .orElseThrow(() -> new ResourceNotFoundException("Curriculum", "id", request.getCurriculumId()));

        final Chapter chapter = chapterRepository.findByIdAndActiveTrue(request.getChapterId())
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", request.getChapterId()));

        final Topic topic = topicRepository.findByIdAndActiveTrue(request.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", request.getTopicId()));

        // Validate hierarchy: Chapter must belong to Curriculum, Topic must belong to Chapter
        if (chapter.getCurriculum() != null && !chapter.getCurriculum().getId().equals(curriculum.getId())) {
            throw new BadRequestException("Chapter ID " + request.getChapterId() + " does not belong to Curriculum ID " + request.getCurriculumId());
        }

        if (topic.getChapter() != null && !topic.getChapter().getId().equals(chapter.getId())) {
            throw new BadRequestException("Topic ID " + request.getTopicId() + " does not belong to Chapter ID " + request.getChapterId());
        }

        final LessonSession lessonSession = lessonSessionMapper.toEntity(request);
        lessonSession.setCurriculum(curriculum);
        lessonSession.setChapter(chapter);
        lessonSession.setTopic(topic);
        lessonSession.setStatus(LessonStatus.PLANNED);
        if (request.getTeachingMode() != null) {
            lessonSession.setTeachingMode(request.getTeachingMode());
        } else {
            lessonSession.setTeachingMode(TeachingMode.OFFLINE);
        }
        if (lessonSession.getActive() == null) {
            lessonSession.setActive(true);
        }
        final java.time.LocalDateTime now = java.time.LocalDateTime.now();
        if (lessonSession.getCreatedAt() == null) {
            lessonSession.setCreatedAt(now);
        }
        if (lessonSession.getUpdatedAt() == null) {
            lessonSession.setUpdatedAt(now);
        }

        final LessonSession saved = lessonSessionRepository.save(lessonSession);
        log.info("Lesson session created successfully with ID: {}", saved.getId());
        return lessonSessionMapper.toResponse(saved);
    }

    @Override
    public LessonSessionResponse getLessonSessionById(final UUID id) {
        log.debug("Fetching lesson session by ID: {}", id);
        final LessonSession lessonSession = lessonSessionRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("LessonSession", "id", id));
        return lessonSessionMapper.toResponse(lessonSession);
    }

    @Override
    public PageResponse<LessonSessionResponse> getAllLessonSessions(final Pageable pageable) {
        log.debug("Fetching all active lesson sessions");
        final Page<LessonSessionResponse> page = lessonSessionRepository.findByActiveTrue(pageable)
                .map(lessonSessionMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    public PageResponse<LessonSessionResponse> searchLessonSessions(final LessonSearchRequest searchRequest, final Pageable pageable) {
        log.debug("Searching lesson sessions with filters");
        final Specification<LessonSession> spec = LessonSessionSpecification.buildSpecification(searchRequest);
        final Page<LessonSessionResponse> page = lessonSessionRepository.findAll(spec, pageable)
                .map(lessonSessionMapper::toResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional
    public LessonSessionResponse updateLessonSession(final UUID id, final UpdateLessonSessionRequest request) {
        log.info("Updating lesson session with ID: {}", id);
        final LessonSession lessonSession = lessonSessionRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("LessonSession", "id", id));

        final LocalTime startTime = request.getStartTime() != null ? request.getStartTime() : lessonSession.getStartTime();
        final LocalTime endTime = request.getEndTime() != null ? request.getEndTime() : lessonSession.getEndTime();
        final Integer duration = request.getEstimatedDurationMinutes() != null ? request.getEstimatedDurationMinutes() : lessonSession.getEstimatedDurationMinutes();

        validateTimes(startTime, endTime, duration);

        if (request.getCurriculumId() != null) {
            final Curriculum curriculum = curriculumRepository.findByIdAndActiveTrue(request.getCurriculumId())
                    .orElseThrow(() -> new ResourceNotFoundException("Curriculum", "id", request.getCurriculumId()));
            lessonSession.setCurriculum(curriculum);
        }

        if (request.getChapterId() != null) {
            final Chapter chapter = chapterRepository.findByIdAndActiveTrue(request.getChapterId())
                    .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", request.getChapterId()));
            if (!chapter.getCurriculum().getId().equals(lessonSession.getCurriculum().getId())) {
                throw new BadRequestException("Chapter does not belong to the selected Curriculum");
            }
            lessonSession.setChapter(chapter);
        }

        if (request.getTopicId() != null) {
            final Topic topic = topicRepository.findByIdAndActiveTrue(request.getTopicId())
                    .orElseThrow(() -> new ResourceNotFoundException("Topic", "id", request.getTopicId()));
            if (!topic.getChapter().getId().equals(lessonSession.getChapter().getId())) {
                throw new BadRequestException("Topic does not belong to the selected Chapter");
            }
            lessonSession.setTopic(topic);
        }

        lessonSessionMapper.updateEntityFromRequest(request, lessonSession);
        final LessonSession updated = lessonSessionRepository.save(lessonSession);
        log.info("Lesson session updated successfully with ID: {}", updated.getId());
        return lessonSessionMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public LessonSessionResponse completeLesson(final UUID id) {
        log.info("Marking lesson session as COMPLETED for ID: {}", id);
        final LessonSession lessonSession = lessonSessionRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("LessonSession", "id", id));

        if (lessonSession.getStatus() == LessonStatus.CANCELLED) {
            throw new BadRequestException("Cannot complete a cancelled lesson session");
        }

        lessonSession.setStatus(LessonStatus.COMPLETED);
        final LessonSession saved = lessonSessionRepository.save(lessonSession);
        log.info("Lesson session completed successfully for ID: {}", id);
        return lessonSessionMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public LessonSessionResponse cancelLesson(final UUID id) {
        log.info("Marking lesson session as CANCELLED for ID: {}", id);
        final LessonSession lessonSession = lessonSessionRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("LessonSession", "id", id));

        lessonSession.setStatus(LessonStatus.CANCELLED);
        final LessonSession saved = lessonSessionRepository.save(lessonSession);
        log.info("Lesson session cancelled successfully for ID: {}", id);
        return lessonSessionMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteLessonSession(final UUID id) {
        log.info("Soft deleting lesson session with ID: {}", id);
        final LessonSession lessonSession = lessonSessionRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("LessonSession", "id", id));
        lessonSession.setActive(false);
        lessonSessionRepository.save(lessonSession);
        log.info("Lesson session soft deleted with ID: {}", id);
    }

    private void validateTimes(final LocalTime startTime, final LocalTime endTime, final Integer durationMinutes) {
        if (durationMinutes != null && durationMinutes <= 0) {
            throw new BadRequestException("Lesson duration must be a positive integer in minutes");
        }
        if (startTime != null && endTime != null && !endTime.isAfter(startTime)) {
            throw new BadRequestException("Lesson end time must be strictly after start time");
        }
    }
}

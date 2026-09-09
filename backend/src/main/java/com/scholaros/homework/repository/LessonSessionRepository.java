package com.scholaros.homework.repository;

import com.scholaros.homework.entity.LessonSession;
import com.scholaros.homework.entity.LessonStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LessonSessionRepository extends JpaRepository<LessonSession, UUID>, JpaSpecificationExecutor<LessonSession> {

    Optional<LessonSession> findByIdAndActiveTrue(UUID id);

    Page<LessonSession> findByActiveTrue(Pageable pageable);

    Page<LessonSession> findByTeacherIdAndActiveTrue(UUID teacherId, Pageable pageable);

    Page<LessonSession> findBySchoolIdAndActiveTrue(UUID schoolId, Pageable pageable);

    Page<LessonSession> findBySectionIdAndActiveTrue(UUID sectionId, Pageable pageable);

    Page<LessonSession> findByTopicIdAndActiveTrue(UUID topicId, Pageable pageable);

    Page<LessonSession> findByChapterIdAndActiveTrue(UUID chapterId, Pageable pageable);

    Page<LessonSession> findByCurriculumIdAndActiveTrue(UUID curriculumId, Pageable pageable);

    Page<LessonSession> findByLessonDateAndActiveTrue(LocalDate lessonDate, Pageable pageable);

    Page<LessonSession> findByStatusAndActiveTrue(LessonStatus status, Pageable pageable);

    Page<LessonSession> findByLessonDateBetweenAndActiveTrue(LocalDate startDate, LocalDate endDate, Pageable pageable);
}

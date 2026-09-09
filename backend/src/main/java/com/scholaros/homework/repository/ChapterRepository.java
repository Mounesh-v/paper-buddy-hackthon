package com.scholaros.homework.repository;

import com.scholaros.homework.entity.Chapter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, UUID> {

    Optional<Chapter> findByIdAndActiveTrue(UUID id);

    boolean existsByCurriculumIdAndChapterNumber(UUID curriculumId, Integer chapterNumber);

    boolean existsByCurriculumIdAndChapterNumberAndIdNot(UUID curriculumId, Integer chapterNumber, UUID id);

    Page<Chapter> findByActiveTrue(Pageable pageable);

    Page<Chapter> findByCurriculumIdAndActiveTrue(UUID curriculumId, Pageable pageable);

    Page<Chapter> findByTitleContainingIgnoreCaseAndActiveTrue(String titleQuery, Pageable pageable);
}

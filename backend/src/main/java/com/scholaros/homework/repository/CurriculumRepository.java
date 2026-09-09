package com.scholaros.homework.repository;

import com.scholaros.homework.entity.Curriculum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CurriculumRepository extends JpaRepository<Curriculum, UUID> {

    Optional<Curriculum> findByIdAndActiveTrue(UUID id);

    boolean existsByBoardIdAndGradeIgnoreCaseAndSubjectIgnoreCase(UUID boardId, String grade, String subject);

    boolean existsByBoardIdAndGradeIgnoreCaseAndSubjectIgnoreCaseAndIdNot(UUID boardId, String grade, String subject, UUID id);

    Page<Curriculum> findByActiveTrue(Pageable pageable);

    Page<Curriculum> findByBoardIdAndActiveTrue(UUID boardId, Pageable pageable);

    Page<Curriculum> findByGradeContainingIgnoreCaseOrSubjectContainingIgnoreCaseAndActiveTrue(
            String gradeQuery, String subjectQuery, Pageable pageable
    );
}

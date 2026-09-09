package com.scholaros.homework.repository;

import com.scholaros.homework.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {

    Optional<Question> findByIdAndActiveTrue(UUID id);

    List<Question> findByAssessmentIdAndActiveTrueOrderByDisplayOrderAsc(UUID assessmentId);

    Page<Question> findByAssessmentIdAndActiveTrue(UUID assessmentId, Pageable pageable);

    long countByAssessmentIdAndActiveTrue(UUID assessmentId);
}

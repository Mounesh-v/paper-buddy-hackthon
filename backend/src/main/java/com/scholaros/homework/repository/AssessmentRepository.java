package com.scholaros.homework.repository;

import com.scholaros.homework.entity.Assessment;
import com.scholaros.homework.entity.AssessmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, UUID>, JpaSpecificationExecutor<Assessment> {

    Optional<Assessment> findByIdAndActiveTrue(UUID id);

    Page<Assessment> findByActiveTrue(Pageable pageable);

    Page<Assessment> findByLessonSessionIdAndActiveTrue(UUID lessonSessionId, Pageable pageable);

    Page<Assessment> findByStatusAndActiveTrue(AssessmentStatus status, Pageable pageable);
}

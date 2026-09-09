package com.scholaros.homework.repository;

import com.scholaros.homework.entity.LearningRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LearningRecordRepository extends JpaRepository<LearningRecord, UUID> {

    Optional<LearningRecord> findByStudentIdAndTopicIdAndActiveTrue(UUID studentId, UUID topicId);

    List<LearningRecord> findByStudentIdAndActiveTrue(UUID studentId);

    Page<LearningRecord> findByStudentIdAndActiveTrue(UUID studentId, Pageable pageable);

    List<LearningRecord> findBySectionIdAndActiveTrue(UUID sectionId);

    Page<LearningRecord> findByTopicIdAndActiveTrue(UUID topicId, Pageable pageable);

    Page<LearningRecord> findBySectionIdAndActiveTrue(UUID sectionId, Pageable pageable);
}

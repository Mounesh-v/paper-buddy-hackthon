package com.scholaros.homework.repository;

import com.scholaros.homework.entity.ConceptMastery;
import com.scholaros.homework.entity.MasteryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConceptMasteryRepository extends JpaRepository<ConceptMastery, UUID> {

    List<ConceptMastery> findByLearningRecordId(UUID learningRecordId);

    Optional<ConceptMastery> findByLearningRecordIdAndConceptName(UUID learningRecordId, String conceptName);

    List<ConceptMastery> findByLearningRecordStudentId(UUID studentId);

    List<ConceptMastery> findByLearningRecordStudentIdAndMasteryLevel(UUID studentId, MasteryStatus masteryLevel);
}

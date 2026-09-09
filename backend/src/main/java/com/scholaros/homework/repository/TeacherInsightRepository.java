package com.scholaros.homework.repository;

import com.scholaros.homework.entity.TeacherInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeacherInsightRepository extends JpaRepository<TeacherInsight, UUID> {

    Optional<TeacherInsight> findFirstByTeacherIdAndActiveTrueOrderByGeneratedAtDesc(UUID teacherId);

    Optional<TeacherInsight> findFirstBySectionIdAndActiveTrueOrderByGeneratedAtDesc(UUID sectionId);
}

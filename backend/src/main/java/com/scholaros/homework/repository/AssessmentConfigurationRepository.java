package com.scholaros.homework.repository;

import com.scholaros.homework.entity.AssessmentConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentConfigurationRepository extends JpaRepository<AssessmentConfiguration, UUID> {

    Optional<AssessmentConfiguration> findByAssessmentId(UUID assessmentId);
}

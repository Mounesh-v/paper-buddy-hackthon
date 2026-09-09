package com.scholaros.homework.service;

import com.scholaros.homework.dto.ConceptMasteryResponse;
import com.scholaros.homework.mapper.ConceptMasteryMapper;
import com.scholaros.homework.repository.ConceptMasteryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConceptMasteryServiceImpl implements ConceptMasteryService {

    private final ConceptMasteryRepository masteryRepository;
    private final ConceptMasteryMapper masteryMapper;

    @Override
    public List<ConceptMasteryResponse> getConceptMasteriesByStudent(final UUID studentId) {
        log.debug("Fetching concept masteries for student ID: {}", studentId);
        return masteryRepository.findByLearningRecordStudentId(studentId).stream()
                .map(masteryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ConceptMasteryResponse> getConceptMasteriesByRecord(final UUID learningRecordId) {
        log.debug("Fetching concept masteries for learning record ID: {}", learningRecordId);
        return masteryRepository.findByLearningRecordId(learningRecordId).stream()
                .map(masteryMapper::toResponse)
                .collect(Collectors.toList());
    }
}

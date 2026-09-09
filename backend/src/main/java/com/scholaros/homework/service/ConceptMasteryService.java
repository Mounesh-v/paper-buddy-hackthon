package com.scholaros.homework.service;

import com.scholaros.homework.dto.ConceptMasteryResponse;

import java.util.List;
import java.util.UUID;

public interface ConceptMasteryService {

    List<ConceptMasteryResponse> getConceptMasteriesByStudent(UUID studentId);

    List<ConceptMasteryResponse> getConceptMasteriesByRecord(UUID learningRecordId);
}

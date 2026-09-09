package com.scholaros.homework.service;

import com.scholaros.homework.dto.TeacherInsightResponse;

import java.util.UUID;

public interface TeacherInsightService {

    TeacherInsightResponse generateTeacherInsight(UUID teacherId, UUID sectionId, UUID schoolId);

    TeacherInsightResponse getLatestTeacherInsight(UUID teacherId);
}

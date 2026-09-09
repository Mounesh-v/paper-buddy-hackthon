package com.scholaros.homework.service;

import com.scholaros.homework.dto.ClassAnalyticsResponse;
import com.scholaros.homework.dto.LearningRecordResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.StudentDashboardResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AnalyticsService {

    StudentDashboardResponse getStudentDashboard(UUID studentId);

    ClassAnalyticsResponse getClassAnalytics(UUID sectionId, UUID schoolId);

    PageResponse<LearningRecordResponse> getTopicAnalytics(UUID topicId, Pageable pageable);
}

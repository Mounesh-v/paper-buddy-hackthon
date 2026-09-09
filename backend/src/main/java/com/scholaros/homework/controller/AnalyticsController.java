package com.scholaros.homework.controller;

import com.scholaros.homework.common.ApiResponse;
import com.scholaros.homework.dto.ClassAnalyticsResponse;
import com.scholaros.homework.dto.ConceptMasteryResponse;
import com.scholaros.homework.dto.LearningRecordResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.dto.StudentDashboardResponse;
import com.scholaros.homework.dto.TeacherInsightResponse;
import com.scholaros.homework.service.AnalyticsService;
import com.scholaros.homework.service.ConceptMasteryService;
import com.scholaros.homework.service.TeacherInsightService;
import com.scholaros.homework.util.ApiConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping(ApiConstants.API_V1_PREFIX + "/analytics")
@RequiredArgsConstructor
@Tag(name = "Learning Analytics & Insights", description = "APIs for student dashboards, class analytics, topic performance, concept mastery, and teacher insights")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final ConceptMasteryService conceptMasteryService;
    private final TeacherInsightService teacherInsightService;

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get student dashboard analytics", description = "Retrieves aggregated student learning dashboard metrics, topic masteries, and concept breakdown")
    public ResponseEntity<ApiResponse<StudentDashboardResponse>> getStudentDashboard(@PathVariable final UUID studentId) {
        log.info("REST request for student dashboard analytics for student ID: {}", studentId);
        final StudentDashboardResponse response = analyticsService.getStudentDashboard(studentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/class")
    @Operation(summary = "Get class analytics", description = "Retrieves aggregated section/class learning metrics, strongest/weakest topics, and student performance clusters")
    public ResponseEntity<ApiResponse<ClassAnalyticsResponse>> getClassAnalytics(
            @RequestParam(required = false) final UUID sectionId,
            @RequestParam(required = false) final UUID schoolId
    ) {
        log.info("REST request for class analytics");
        final ClassAnalyticsResponse response = analyticsService.getClassAnalytics(sectionId, schoolId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/topic/{topicId}")
    @Operation(summary = "Get topic analytics", description = "Retrieves paginated student learning records for a specific topic")
    public ResponseEntity<ApiResponse<PageResponse<LearningRecordResponse>>> getTopicAnalytics(
            @PathVariable final UUID topicId,
            @PageableDefault(sort = "overallMasteryPercentage", direction = Sort.Direction.DESC) final Pageable pageable
    ) {
        log.info("REST request for topic analytics for topic ID: {}", topicId);
        final PageResponse<LearningRecordResponse> page = analyticsService.getTopicAnalytics(topicId, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get teacher insights", description = "Retrieves teacher insights and recommendations for section revision")
    public ResponseEntity<ApiResponse<TeacherInsightResponse>> getTeacherInsight(@PathVariable final UUID teacherId) {
        log.info("REST request for teacher insights for teacher ID: {}", teacherId);
        final TeacherInsightResponse response = teacherInsightService.getLatestTeacherInsight(teacherId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/mastery/{studentId}")
    @Operation(summary = "Get student concept mastery breakdown", description = "Retrieves detailed concept-level mastery scores for a student")
    public ResponseEntity<ApiResponse<List<ConceptMasteryResponse>>> getConceptMastery(@PathVariable final UUID studentId) {
        log.info("REST request for concept mastery breakdown for student ID: {}", studentId);
        final List<ConceptMasteryResponse> response = conceptMasteryService.getConceptMasteriesByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

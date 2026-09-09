package com.scholaros.homework.controller;

import com.scholaros.homework.config.SecurityConfig;
import com.scholaros.homework.dto.ClassAnalyticsResponse;
import com.scholaros.homework.dto.StudentDashboardResponse;
import com.scholaros.homework.dto.TeacherInsightResponse;
import com.scholaros.homework.security.CustomAccessDeniedHandler;
import com.scholaros.homework.security.JwtAuthenticationEntryPoint;
import com.scholaros.homework.security.JwtAuthenticationFilter;
import com.scholaros.homework.security.JwtTokenProvider;
import com.scholaros.homework.service.AnalyticsService;
import com.scholaros.homework.service.ConceptMasteryService;
import com.scholaros.homework.service.TeacherInsightService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AnalyticsController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class AnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AnalyticsService analyticsService;

    @MockitoBean
    private ConceptMasteryService conceptMasteryService;

    @MockitoBean
    private TeacherInsightService teacherInsightService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockitoBean
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Test
    @WithMockUser
    @DisplayName("GET /api/v1/analytics/student/{studentId} should return student dashboard")
    void shouldGetStudentDashboard() throws Exception {
        final UUID studentId = UUID.randomUUID();

        final StudentDashboardResponse response = StudentDashboardResponse.builder()
                .studentId(studentId)
                .overallMasteryPercentage(85.5)
                .averageAssessmentScore(88.0)
                .averageHomeworkScore(82.0)
                .homeworkCompletionRate(100.0)
                .totalAssessmentsTaken(4)
                .totalHomeworkCompleted(3)
                .totalStudyMinutes(120)
                .topicMasteries(Collections.emptyList())
                .conceptBreakdown(Collections.emptyList())
                .build();

        given(analyticsService.getStudentDashboard(studentId)).willReturn(response);

        mockMvc.perform(get("/api/v1/analytics/student/{studentId}", studentId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.overallMasteryPercentage").value(85.5));
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/v1/analytics/class should return class analytics")
    void shouldGetClassAnalytics() throws Exception {
        final ClassAnalyticsResponse response = ClassAnalyticsResponse.builder()
                .averageClassMastery(78.5)
                .averageHomeworkCompletion(90.0)
                .averageAssessmentScore(80.0)
                .strongestTopics(Collections.singletonList("Chemical Reactions"))
                .weakestTopics(Collections.singletonList("Balancing Equations"))
                .build();

        given(analyticsService.getClassAnalytics(any(), any())).willReturn(response);

        mockMvc.perform(get("/api/v1/analytics/class"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.averageClassMastery").value(78.5));
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/v1/analytics/teacher/{teacherId} should return teacher insights")
    void shouldGetTeacherInsights() throws Exception {
        final UUID teacherId = UUID.randomUUID();

        final TeacherInsightResponse response = TeacherInsightResponse.builder()
                .id(UUID.randomUUID())
                .teacherId(teacherId)
                .summary("Class section aggregated summary")
                .strongTopics(Collections.singletonList("Chemical Reactions"))
                .weakTopics(Collections.singletonList("Balancing Equations"))
                .build();

        given(teacherInsightService.getLatestTeacherInsight(teacherId)).willReturn(response);

        mockMvc.perform(get("/api/v1/analytics/teacher/{teacherId}", teacherId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.summary").value("Class section aggregated summary"));
    }
}

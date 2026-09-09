package com.scholaros.homework.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholaros.homework.config.SecurityConfig;
import com.scholaros.homework.dto.AssessmentAttemptResponse;
import com.scholaros.homework.dto.AssessmentResultResponse;
import com.scholaros.homework.dto.StartAssessmentRequest;
import com.scholaros.homework.dto.SubmitAssessmentRequest;
import com.scholaros.homework.entity.AttemptStatus;
import com.scholaros.homework.security.CustomAccessDeniedHandler;
import com.scholaros.homework.security.JwtAuthenticationEntryPoint;
import com.scholaros.homework.security.JwtAuthenticationFilter;
import com.scholaros.homework.security.JwtTokenProvider;
import com.scholaros.homework.service.AssessmentAttemptService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AssessmentAttemptController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class AssessmentAttemptControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AssessmentAttemptService attemptService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockitoBean
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/assessment-attempts/start should start assessment attempt")
    void shouldStartAssessment() throws Exception {
        final UUID assessmentId = UUID.randomUUID();
        final UUID studentId = UUID.randomUUID();
        final UUID schoolId = UUID.randomUUID();
        final UUID sectionId = UUID.randomUUID();

        final StartAssessmentRequest request = StartAssessmentRequest.builder()
                .assessmentId(assessmentId)
                .studentId(studentId)
                .schoolId(schoolId)
                .sectionId(sectionId)
                .build();

        final AssessmentAttemptResponse response = AssessmentAttemptResponse.builder()
                .id(UUID.randomUUID())
                .assessmentId(assessmentId)
                .assessmentTitle("Chemical Reactions Practice")
                .studentId(studentId)
                .schoolId(schoolId)
                .sectionId(sectionId)
                .startedAt(LocalDateTime.now())
                .attemptNumber(1)
                .status(AttemptStatus.IN_PROGRESS)
                .build();

        given(attemptService.startAssessment(any(StartAssessmentRequest.class))).willReturn(response);

        mockMvc.perform(post("/api/v1/assessment-attempts/start")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("IN_PROGRESS"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/assessment-attempts/{id}/submit should submit attempt")
    void shouldSubmitAssessment() throws Exception {
        final UUID attemptId = UUID.randomUUID();

        final AssessmentAttemptResponse response = AssessmentAttemptResponse.builder()
                .id(attemptId)
                .status(AttemptStatus.EVALUATED)
                .score(10.0)
                .maximumScore(10.0)
                .percentage(100.0)
                .passed(true)
                .evaluationCompleted(true)
                .build();

        given(attemptService.submitAssessment(any(UUID.class), any())).willReturn(response);

        mockMvc.perform(post("/api/v1/assessment-attempts/{id}/submit", attemptId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SubmitAssessmentRequest())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("EVALUATED"))
                .andExpect(jsonPath("$.data.score").value(10.0));
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/v1/assessment-attempts/{id}/result should return result breakdown")
    void shouldGetAttemptResult() throws Exception {
        final UUID attemptId = UUID.randomUUID();

        final AssessmentResultResponse response = AssessmentResultResponse.builder()
                .attemptId(attemptId)
                .assessmentTitle("Chemical Reactions Practice")
                .status(AttemptStatus.EVALUATED)
                .score(10.0)
                .maximumScore(10.0)
                .percentage(100.0)
                .passed(true)
                .totalQuestions(5)
                .totalAttempted(5)
                .totalCorrect(5)
                .build();

        given(attemptService.getAttemptResult(attemptId)).willReturn(response);

        mockMvc.perform(get("/api/v1/assessment-attempts/{id}/result", attemptId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalCorrect").value(5));
    }
}

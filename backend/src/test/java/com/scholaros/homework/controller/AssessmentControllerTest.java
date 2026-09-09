package com.scholaros.homework.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholaros.homework.config.SecurityConfig;
import com.scholaros.homework.dto.AssessmentResponse;
import com.scholaros.homework.dto.CreateAssessmentRequest;
import com.scholaros.homework.entity.AssessmentStatus;
import com.scholaros.homework.entity.AssessmentType;
import com.scholaros.homework.security.CustomAccessDeniedHandler;
import com.scholaros.homework.security.JwtAuthenticationEntryPoint;
import com.scholaros.homework.security.JwtAuthenticationFilter;
import com.scholaros.homework.security.JwtTokenProvider;
import com.scholaros.homework.service.AssessmentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AssessmentController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class AssessmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AssessmentService assessmentService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockitoBean
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/assessments should create assessment")
    void shouldCreateAssessment() throws Exception {
        final UUID lessonId = UUID.randomUUID();
        final CreateAssessmentRequest request = CreateAssessmentRequest.builder()
                .title("Chemical Reactions Practice")
                .lessonSessionId(lessonId)
                .assessmentType(AssessmentType.PRACTICE)
                .estimatedDurationMinutes(30)
                .build();

        final AssessmentResponse response = AssessmentResponse.builder()
                .id(UUID.randomUUID())
                .title("Chemical Reactions Practice")
                .lessonSessionId(lessonId)
                .assessmentType(AssessmentType.PRACTICE)
                .status(AssessmentStatus.DRAFT)
                .totalMarks(0)
                .active(true)
                .build();

        given(assessmentService.createAssessment(any(CreateAssessmentRequest.class))).willReturn(response);

        mockMvc.perform(post("/api/v1/assessments")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Chemical Reactions Practice"))
                .andExpect(jsonPath("$.data.status").value("DRAFT"));
    }

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/v1/assessments/{id}/publish should publish assessment")
    void shouldPublishAssessment() throws Exception {
        final UUID assessmentId = UUID.randomUUID();

        final AssessmentResponse response = AssessmentResponse.builder()
                .id(assessmentId)
                .title("Chemical Reactions Practice")
                .status(AssessmentStatus.PUBLISHED)
                .active(true)
                .build();

        given(assessmentService.publishAssessment(assessmentId)).willReturn(response);

        mockMvc.perform(patch("/api/v1/assessments/{id}/publish", assessmentId).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PUBLISHED"));
    }
}

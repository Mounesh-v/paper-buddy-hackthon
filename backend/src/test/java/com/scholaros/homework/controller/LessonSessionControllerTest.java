package com.scholaros.homework.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholaros.homework.config.SecurityConfig;
import com.scholaros.homework.dto.CreateLessonSessionRequest;
import com.scholaros.homework.dto.LessonSessionResponse;
import com.scholaros.homework.entity.LessonStatus;
import com.scholaros.homework.entity.TeachingMode;
import com.scholaros.homework.security.CustomAccessDeniedHandler;
import com.scholaros.homework.security.JwtAuthenticationEntryPoint;
import com.scholaros.homework.security.JwtAuthenticationFilter;
import com.scholaros.homework.security.JwtTokenProvider;
import com.scholaros.homework.service.LessonSessionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LessonSessionController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class LessonSessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private LessonSessionService lessonSessionService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockitoBean
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/lessons should create lesson session")
    void shouldCreateLessonSession() throws Exception {
        final UUID teacherId = UUID.randomUUID();
        final UUID schoolId = UUID.randomUUID();
        final UUID sectionId = UUID.randomUUID();
        final UUID curriculumId = UUID.randomUUID();
        final UUID chapterId = UUID.randomUUID();
        final UUID topicId = UUID.randomUUID();

        final CreateLessonSessionRequest request = CreateLessonSessionRequest.builder()
                .lessonTitle("Balancing Chemical Equations")
                .teacherId(teacherId)
                .schoolId(schoolId)
                .sectionId(sectionId)
                .curriculumId(curriculumId)
                .chapterId(chapterId)
                .topicId(topicId)
                .lessonDate(LocalDate.of(2026, 8, 3))
                .startTime(LocalTime.of(9, 30))
                .endTime(LocalTime.of(10, 15))
                .estimatedDurationMinutes(45)
                .teachingMode(TeachingMode.OFFLINE)
                .build();

        final LessonSessionResponse response = LessonSessionResponse.builder()
                .id(UUID.randomUUID())
                .lessonTitle("Balancing Chemical Equations")
                .teacherId(teacherId)
                .schoolId(schoolId)
                .sectionId(sectionId)
                .curriculumId(curriculumId)
                .chapterId(chapterId)
                .topicId(topicId)
                .lessonDate(LocalDate.of(2026, 8, 3))
                .status(LessonStatus.PLANNED)
                .teachingMode(TeachingMode.OFFLINE)
                .active(true)
                .build();

        given(lessonSessionService.createLessonSession(any(CreateLessonSessionRequest.class))).willReturn(response);

        mockMvc.perform(post("/api/v1/lessons")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.lessonTitle").value("Balancing Chemical Equations"))
                .andExpect(jsonPath("$.data.status").value("PLANNED"));
    }

    @Test
    @WithMockUser
    @DisplayName("PATCH /api/v1/lessons/{id}/complete should mark lesson as COMPLETED")
    void shouldCompleteLesson() throws Exception {
        final UUID lessonId = UUID.randomUUID();

        final LessonSessionResponse response = LessonSessionResponse.builder()
                .id(lessonId)
                .lessonTitle("Balancing Chemical Equations")
                .status(LessonStatus.COMPLETED)
                .active(true)
                .build();

        given(lessonSessionService.completeLesson(lessonId)).willReturn(response);

        mockMvc.perform(patch("/api/v1/lessons/{id}/complete", lessonId).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));
    }
}

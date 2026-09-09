package com.scholaros.homework.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholaros.homework.config.SecurityConfig;
import com.scholaros.homework.dto.GenerateHomeworkRequest;
import com.scholaros.homework.dto.HomeworkAssignmentResponse;
import com.scholaros.homework.dto.HomeworkSubmissionResponse;
import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.entity.HomeworkStatus;
import com.scholaros.homework.security.CustomAccessDeniedHandler;
import com.scholaros.homework.security.JwtAuthenticationEntryPoint;
import com.scholaros.homework.security.JwtAuthenticationFilter;
import com.scholaros.homework.security.JwtTokenProvider;
import com.scholaros.homework.service.HomeworkAssignmentService;
import com.scholaros.homework.service.HomeworkFeedbackService;
import com.scholaros.homework.service.HomeworkGeneratorService;
import com.scholaros.homework.service.HomeworkSubmissionService;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HomeworkController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class HomeworkControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private HomeworkGeneratorService generatorService;

    @MockitoBean
    private HomeworkAssignmentService assignmentService;

    @MockitoBean
    private HomeworkSubmissionService submissionService;

    @MockitoBean
    private HomeworkFeedbackService feedbackService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockitoBean
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/homework/generate should generate AI homework")
    void shouldGenerateHomework() throws Exception {
        final UUID recId = UUID.randomUUID();
        final UUID teacherId = UUID.randomUUID();

        final GenerateHomeworkRequest request = GenerateHomeworkRequest.builder()
                .homeworkRecommendationId(recId)
                .teacherId(teacherId)
                .dueDate(LocalDateTime.now().plusDays(2))
                .build();

        final HomeworkAssignmentResponse response = HomeworkAssignmentResponse.builder()
                .id(UUID.randomUUID())
                .title("Personalized Practice: Chemical Reactions")
                .difficultyLevel(DifficultyLevel.INTERMEDIATE)
                .status(HomeworkStatus.ASSIGNED)
                .generatedByAI(true)
                .build();

        given(generatorService.generateHomeworkFromRecommendation(any(GenerateHomeworkRequest.class))).willReturn(response);

        mockMvc.perform(post("/api/v1/homework/generate")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("ASSIGNED"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/homework/{id}/submit should submit homework")
    void shouldSubmitHomework() throws Exception {
        final UUID homeworkId = UUID.randomUUID();

        final HomeworkSubmissionResponse response = HomeworkSubmissionResponse.builder()
                .id(UUID.randomUUID())
                .homeworkAssignmentId(homeworkId)
                .score(10.0)
                .percentage(100.0)
                .submitted(true)
                .build();

        given(submissionService.submitHomework(any(UUID.class), any())).willReturn(response);

        mockMvc.perform(post("/api/v1/homework/{id}/submit", homeworkId).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.percentage").value(100.0));
    }
}

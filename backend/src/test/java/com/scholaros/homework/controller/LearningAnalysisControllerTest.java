package com.scholaros.homework.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholaros.homework.config.SecurityConfig;
import com.scholaros.homework.dto.GenerateAnalysisRequest;
import com.scholaros.homework.dto.HomeworkRecommendationResponse;
import com.scholaros.homework.dto.LearningAnalysisResponse;
import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.entity.MasteryLevel;
import com.scholaros.homework.entity.RecommendationPriority;
import com.scholaros.homework.security.CustomAccessDeniedHandler;
import com.scholaros.homework.security.JwtAuthenticationEntryPoint;
import com.scholaros.homework.security.JwtAuthenticationFilter;
import com.scholaros.homework.security.JwtTokenProvider;
import com.scholaros.homework.service.HomeworkRecommendationService;
import com.scholaros.homework.service.LearningAnalysisService;
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

@WebMvcTest(LearningAnalysisController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class LearningAnalysisControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private LearningAnalysisService analysisService;

    @MockitoBean
    private HomeworkRecommendationService recommendationService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockitoBean
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/analysis/generate should generate AI learning analysis")
    void shouldGenerateAnalysis() throws Exception {
        final UUID attemptId = UUID.randomUUID();
        final GenerateAnalysisRequest request = GenerateAnalysisRequest.builder()
                .assessmentAttemptId(attemptId)
                .build();

        final LearningAnalysisResponse response = LearningAnalysisResponse.builder()
                .id(UUID.randomUUID())
                .assessmentAttemptId(attemptId)
                .overallMasteryPercentage(85.0)
                .masteryLevel(MasteryLevel.GOOD)
                .analysisSummary("Student performed well")
                .analysisTimestamp(LocalDateTime.now())
                .build();

        given(analysisService.generateAnalysis(any(GenerateAnalysisRequest.class))).willReturn(response);

        mockMvc.perform(post("/api/v1/analysis/generate")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.masteryLevel").value("GOOD"));
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/v1/recommendations/{attemptId} should return recommendation")
    void shouldGetRecommendation() throws Exception {
        final UUID attemptId = UUID.randomUUID();

        final HomeworkRecommendationResponse response = HomeworkRecommendationResponse.builder()
                .id(UUID.randomUUID())
                .recommendedDifficulty(DifficultyLevel.INTERMEDIATE)
                .recommendedQuestionCount(5)
                .recommendedPracticeMinutes(15)
                .priorityLevel(RecommendationPriority.MEDIUM)
                .recommendationReason("Targeted practice to reinforce key concepts.")
                .build();

        given(recommendationService.getRecommendationByAttemptId(attemptId)).willReturn(response);

        mockMvc.perform(get("/api/v1/recommendations/{attemptId}", attemptId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.recommendedQuestionCount").value(5))
                .andExpect(jsonPath("$.data.priorityLevel").value("MEDIUM"));
    }
}

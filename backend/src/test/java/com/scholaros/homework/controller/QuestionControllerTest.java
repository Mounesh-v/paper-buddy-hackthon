package com.scholaros.homework.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholaros.homework.config.SecurityConfig;
import com.scholaros.homework.dto.CreateQuestionRequest;
import com.scholaros.homework.dto.QuestionResponse;
import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.entity.QuestionType;
import com.scholaros.homework.security.CustomAccessDeniedHandler;
import com.scholaros.homework.security.JwtAuthenticationEntryPoint;
import com.scholaros.homework.security.JwtAuthenticationFilter;
import com.scholaros.homework.security.JwtTokenProvider;
import com.scholaros.homework.service.QuestionService;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QuestionController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class QuestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private QuestionService questionService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockitoBean
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/questions should create question")
    void shouldCreateQuestion() throws Exception {
        final UUID assessmentId = UUID.randomUUID();

        final CreateQuestionRequest request = CreateQuestionRequest.builder()
                .assessmentId(assessmentId)
                .questionText("What is the product of hydrogen and oxygen reaction?")
                .questionType(QuestionType.MULTIPLE_CHOICE)
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .marks(2)
                .build();

        final QuestionResponse response = QuestionResponse.builder()
                .id(UUID.randomUUID())
                .assessmentId(assessmentId)
                .questionText("What is the product of hydrogen and oxygen reaction?")
                .questionType(QuestionType.MULTIPLE_CHOICE)
                .marks(2)
                .active(true)
                .build();

        given(questionService.createQuestion(any(CreateQuestionRequest.class))).willReturn(response);

        mockMvc.perform(post("/api/v1/questions")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.marks").value(2));
    }
}

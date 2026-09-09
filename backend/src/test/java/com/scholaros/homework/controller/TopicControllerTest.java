package com.scholaros.homework.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholaros.homework.config.SecurityConfig;
import com.scholaros.homework.dto.CreateTopicRequest;
import com.scholaros.homework.dto.TopicResponse;
import com.scholaros.homework.entity.DifficultyLevel;
import com.scholaros.homework.security.CustomAccessDeniedHandler;
import com.scholaros.homework.security.JwtAuthenticationEntryPoint;
import com.scholaros.homework.security.JwtAuthenticationFilter;
import com.scholaros.homework.security.JwtTokenProvider;
import com.scholaros.homework.service.TopicService;
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

@WebMvcTest(TopicController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class TopicControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TopicService topicService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockitoBean
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/topics should create topic")
    void shouldCreateTopic() throws Exception {
        final UUID chapterId = UUID.randomUUID();
        final CreateTopicRequest request = CreateTopicRequest.builder()
                .chapterId(chapterId)
                .topicName("Agricultural Practices")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .estimatedTeachingMinutes(45)
                .build();

        final TopicResponse response = TopicResponse.builder()
                .id(UUID.randomUUID())
                .chapterId(chapterId)
                .topicName("Agricultural Practices")
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .active(true)
                .build();

        given(topicService.createTopic(any(CreateTopicRequest.class))).willReturn(response);

        mockMvc.perform(post("/api/v1/topics")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.topicName").value("Agricultural Practices"));
    }
}

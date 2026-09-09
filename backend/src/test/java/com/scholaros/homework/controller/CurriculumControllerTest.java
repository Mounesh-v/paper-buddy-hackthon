package com.scholaros.homework.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholaros.homework.config.SecurityConfig;
import com.scholaros.homework.dto.CreateCurriculumRequest;
import com.scholaros.homework.dto.CurriculumResponse;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.security.CustomAccessDeniedHandler;
import com.scholaros.homework.security.JwtAuthenticationEntryPoint;
import com.scholaros.homework.security.JwtAuthenticationFilter;
import com.scholaros.homework.security.JwtTokenProvider;
import com.scholaros.homework.service.CurriculumService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CurriculumController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class CurriculumControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CurriculumService curriculumService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockitoBean
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/curricula should create curriculum")
    void shouldCreateCurriculum() throws Exception {
        final UUID boardId = UUID.randomUUID();
        final CreateCurriculumRequest request = CreateCurriculumRequest.builder()
                .boardId(boardId)
                .grade("Grade 8")
                .subject("Science")
                .build();

        final CurriculumResponse response = CurriculumResponse.builder()
                .id(UUID.randomUUID())
                .boardId(boardId)
                .boardCode("CBSE")
                .grade("Grade 8")
                .subject("Science")
                .active(true)
                .build();

        given(curriculumService.createCurriculum(any(CreateCurriculumRequest.class))).willReturn(response);

        mockMvc.perform(post("/api/v1/curricula")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.grade").value("Grade 8"));
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/v1/curricula/board/{boardId} should return curricula for board")
    void shouldGetCurriculaByBoard() throws Exception {
        final UUID boardId = UUID.randomUUID();
        final CurriculumResponse response = CurriculumResponse.builder()
                .id(UUID.randomUUID())
                .boardId(boardId)
                .grade("Grade 8")
                .subject("Science")
                .build();

        final PageResponse<CurriculumResponse> pageResponse = PageResponse.<CurriculumResponse>builder()
                .content(List.of(response))
                .pageNumber(0)
                .pageSize(10)
                .totalElements(1)
                .totalPages(1)
                .build();

        given(curriculumService.getCurriculaByBoard(any(UUID.class), any(Pageable.class))).willReturn(pageResponse);

        mockMvc.perform(get("/api/v1/curricula/board/{boardId}", boardId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].subject").value("Science"));
    }
}

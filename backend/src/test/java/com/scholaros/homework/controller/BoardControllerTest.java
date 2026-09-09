package com.scholaros.homework.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scholaros.homework.config.SecurityConfig;
import com.scholaros.homework.dto.BoardResponse;
import com.scholaros.homework.dto.CreateBoardRequest;
import com.scholaros.homework.dto.PageResponse;
import com.scholaros.homework.security.CustomAccessDeniedHandler;
import com.scholaros.homework.security.JwtAuthenticationEntryPoint;
import com.scholaros.homework.security.JwtAuthenticationFilter;
import com.scholaros.homework.security.JwtTokenProvider;
import com.scholaros.homework.service.BoardService;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BoardController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class BoardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private BoardService boardService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockitoBean
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/boards should create board")
    void shouldCreateBoard() throws Exception {
        final CreateBoardRequest request = CreateBoardRequest.builder()
                .boardName("CBSE")
                .boardCode("CBSE")
                .description("Central Board")
                .build();

        final BoardResponse response = BoardResponse.builder()
                .id(UUID.randomUUID())
                .boardName("CBSE")
                .boardCode("CBSE")
                .active(true)
                .build();

        given(boardService.createBoard(any(CreateBoardRequest.class))).willReturn(response);

        mockMvc.perform(post("/api/v1/boards")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.boardCode").value("CBSE"));
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/v1/boards/{id} should return board")
    void shouldGetBoardById() throws Exception {
        final UUID boardId = UUID.randomUUID();
        final BoardResponse response = BoardResponse.builder()
                .id(boardId)
                .boardName("CBSE")
                .boardCode("CBSE")
                .active(true)
                .build();

        given(boardService.getBoardById(boardId)).willReturn(response);

        mockMvc.perform(get("/api/v1/boards/{id}", boardId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(boardId.toString()));
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/v1/boards should return page of boards")
    void shouldGetAllBoards() throws Exception {
        final BoardResponse response = BoardResponse.builder()
                .id(UUID.randomUUID())
                .boardName("CBSE")
                .boardCode("CBSE")
                .active(true)
                .build();

        final PageResponse<BoardResponse> pageResponse = PageResponse.<BoardResponse>builder()
                .content(List.of(response))
                .pageNumber(0)
                .pageSize(10)
                .totalElements(1)
                .totalPages(1)
                .first(true)
                .last(true)
                .build();

        given(boardService.getAllBoards(any(Pageable.class))).willReturn(pageResponse);

        mockMvc.perform(get("/api/v1/boards"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].boardCode").value("CBSE"));
    }

    @Test
    @WithMockUser
    @DisplayName("DELETE /api/v1/boards/{id} should soft delete board")
    void shouldDeleteBoard() throws Exception {
        final UUID boardId = UUID.randomUUID();
        doNothing().when(boardService).deleteBoard(boardId);

        mockMvc.perform(delete("/api/v1/boards/{id}", boardId).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}

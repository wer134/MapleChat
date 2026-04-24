package com.example.MapleChat.exception;

import com.example.MapleChat.controller.CharacterController;
import com.example.MapleChat.service.NexonApiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class GlobalExceptionHandlerTest {

    private MockMvc mockMvc;
    private NexonApiService nexonApiService;

    @BeforeEach
    void setUp() {
        nexonApiService = mock(NexonApiService.class);
        mockMvc = MockMvcBuilders
                .standaloneSetup(new CharacterController(nexonApiService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void NexonApiException_404_응답형식확인() throws Exception {
        when(nexonApiService.getBasicByName(anyString()))
                .thenThrow(new NexonApiException("캐릭터를 찾을 수 없습니다: 홍길동", HttpStatus.NOT_FOUND));

        mockMvc.perform(get("/character/basic").param("name", "홍길동"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("캐릭터를 찾을 수 없습니다: 홍길동"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    void NexonApiException_429_응답형식확인() throws Exception {
        when(nexonApiService.getBasicByName(anyString()))
                .thenThrow(new NexonApiException("넥슨 API 요청 한도를 초과했습니다.", HttpStatus.TOO_MANY_REQUESTS));

        mockMvc.perform(get("/character/basic").param("name", "테스트"))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.status").value(429));
    }

    @Test
    void MissingParam_400_응답형식확인() throws Exception {
        mockMvc.perform(get("/character/basic"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    void 일반예외_500_응답형식확인() throws Exception {
        when(nexonApiService.getBasicByName(anyString()))
                .thenThrow(new RuntimeException("예상치 못한 오류"));

        mockMvc.perform(get("/character/basic").param("name", "테스트"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.message").value("서버 오류가 발생했습니다."));
    }
}

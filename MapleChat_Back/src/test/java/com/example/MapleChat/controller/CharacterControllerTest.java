package com.example.MapleChat.controller;

import com.example.MapleChat.dto.character.CharacterBasicInfo;
import com.example.MapleChat.dto.character.CharacterStat;
import com.example.MapleChat.exception.GlobalExceptionHandler;
import com.example.MapleChat.exception.NexonApiException;
import com.example.MapleChat.service.NexonApiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CharacterControllerTest {

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
    void getBasic_성공() throws Exception {
        CharacterBasicInfo info = new CharacterBasicInfo();
        info.setCharacterName("테스트캐릭");
        info.setCharacterLevel(200);
        info.setWorldName("스카니아");
        when(nexonApiService.getBasicByName("테스트캐릭")).thenReturn(info);

        mockMvc.perform(get("/character/basic").param("name", "테스트캐릭"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.character_name").value("테스트캐릭"))
                .andExpect(jsonPath("$.character_level").value(200));
    }

    @Test
    void getBasic_name파라미터없음_400반환() throws Exception {
        mockMvc.perform(get("/character/basic"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void getBasic_존재하지않는캐릭터_404반환() throws Exception {
        when(nexonApiService.getBasicByName("없는캐릭터"))
                .thenThrow(new NexonApiException("캐릭터를 찾을 수 없습니다: 없는캐릭터", HttpStatus.NOT_FOUND));

        mockMvc.perform(get("/character/basic").param("name", "없는캐릭터"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("캐릭터를 찾을 수 없습니다: 없는캐릭터"));
    }

    @Test
    void getBasic_넥슨API오류_502반환() throws Exception {
        when(nexonApiService.getBasicByName("테스트캐릭"))
                .thenThrow(new NexonApiException("넥슨 API 호출에 실패했습니다", HttpStatus.BAD_GATEWAY));

        mockMvc.perform(get("/character/basic").param("name", "테스트캐릭"))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.status").value(502));
    }

    @Test
    void getStat_성공() throws Exception {
        when(nexonApiService.getStatByName("테스트캐릭")).thenReturn(new CharacterStat());

        mockMvc.perform(get("/character/stat").param("name", "테스트캐릭"))
                .andExpect(status().isOk());
    }

    @Test
    void getPopularity_성공() throws Exception {
        mockMvc.perform(get("/character/popularity").param("name", "테스트캐릭"))
                .andExpect(status().isOk());
    }
}

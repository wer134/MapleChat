package com.example.MapleChat.service;

import com.example.MapleChat.exception.NexonApiException;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class NexonApiServiceTest {

    private MockWebServer server;
    private NexonApiService service;

    @BeforeEach
    void setUp() throws IOException {
        server = new MockWebServer();
        server.start();
        service = new NexonApiService("test-key", server.url("/").toString());
    }

    @AfterEach
    void tearDown() throws IOException {
        server.shutdown();
    }

    @Test
    void getBasicByName_성공() throws Exception {
        server.enqueue(new MockResponse()
                .setBody("{\"ocid\":\"test-ocid-123\"}")
                .addHeader("Content-Type", "application/json"));
        server.enqueue(new MockResponse()
                .setBody("{\"character_name\":\"테스트캐릭\",\"character_level\":200,\"world_name\":\"스카니아\",\"character_class\":\"히어로\"}")
                .addHeader("Content-Type", "application/json"));

        var result = service.getBasicByName("테스트캐릭");

        assertThat(result).isNotNull();
        assertThat(result.getCharacterName()).isEqualTo("테스트캐릭");
        assertThat(result.getCharacterLevel()).isEqualTo(200);
    }

    @Test
    void getBasicByName_존재하지않는캐릭터_예외발생() {
        server.enqueue(new MockResponse()
                .setBody("{}")
                .addHeader("Content-Type", "application/json"));

        assertThatThrownBy(() -> service.getBasicByName("없는캐릭터"))
                .isInstanceOf(NexonApiException.class)
                .hasMessageContaining("없는캐릭터");
    }

    @Test
    void fetch_429응답_RATE_LIMIT예외발생() {
        server.enqueue(new MockResponse()
                .setResponseCode(429)
                .setBody("{\"error\":\"rate limit\"}")
                .addHeader("Content-Type", "application/json"));

        assertThatThrownBy(() -> service.getBasicByName("테스트"))
                .isInstanceOf(NexonApiException.class)
                .satisfies(e -> assertThat(((NexonApiException) e).getStatus())
                        .isEqualTo(HttpStatus.TOO_MANY_REQUESTS));
    }

    @Test
    void getBasicByName_OCID캐시사용() throws Exception {
        // 첫 번째 조회: OCID + basic
        server.enqueue(new MockResponse()
                .setBody("{\"ocid\":\"cached-ocid\"}")
                .addHeader("Content-Type", "application/json"));
        server.enqueue(new MockResponse()
                .setBody("{\"character_name\":\"캐시테스트\",\"character_level\":100}")
                .addHeader("Content-Type", "application/json"));
        // 두 번째 조회: OCID는 캐시, basic만
        server.enqueue(new MockResponse()
                .setBody("{\"character_name\":\"캐시테스트\",\"character_level\":100}")
                .addHeader("Content-Type", "application/json"));

        service.getBasicByName("캐시테스트");
        service.getBasicByName("캐시테스트");

        // OCID는 캐시라 두 번째엔 요청 안 감 → 총 3번
        assertThat(server.getRequestCount()).isEqualTo(3);
    }
}

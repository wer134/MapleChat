package com.example.MapleChat.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MapleChat API")
                        .description("메이플스토리 캐릭터/길드/유니온 조회 API")
                        .version("v1.0.0"));
    }
}

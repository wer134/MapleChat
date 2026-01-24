package com.example.MapleChat.service;

import com.example.MapleChat.dto.CharacterBasicInfo;
import com.example.MapleChat.dto.CharacterOcid;
import com.example.MapleChat.dto.CharacterPopularity;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class NexonApiService {
    private final WebClient webClient;

    public NexonApiService( @Value("${nexon.api-key}") String apiKey) {
        this.webClient = WebClient.builder().baseUrl("https://open.api.nexon.com").defaultHeader("x-nxopen-api-key", apiKey).build();
    }
    
    public CharacterOcid getId(String name) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/id")
                .queryParam("character_name", name)
                .build()).retrieve().bodyToMono(CharacterOcid.class).block();
    }

    public CharacterBasicInfo getBasic(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/basic")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterBasicInfo.class).block();
    }

    public CharacterBasicInfo getBasicByName(String name) {
        return getBasic(getId(name).getCharacterOcid());
    }

    public CharacterPopularity getPopularity(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/popularity")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterPopularity.class).block();
    }

    public CharacterPopularity getPopularityByName(String name) {
        return getPopularity(getId(name).getCharacterOcid());
    }

    public String getCharacterImage( String name, String action, Integer actionFrame, String emotion, Integer emotionFrame, String wmotion) {
        CharacterBasicInfo info = getBasicByName(name);
        String baseUrl = info.getCharacterImage();

        return buildCharacterImg(baseUrl, action, actionFrame, emotion, emotionFrame, wmotion);
    }

    public String buildCharacterImg(
            String base,
            String action,
            Integer actionFrame,
            String emotion,
            Integer emotionFrame,
            String wmotion
    ) {
        StringBuilder sb = new StringBuilder(base);
        sb.append("?");

        if (action != null) {
            sb.append("action=").append(action);
            if (actionFrame != null) sb.append(".").append(actionFrame);
            sb.append("&");
        }

        if (emotion != null) {
            sb.append("emotion=").append(emotion);
            if (emotionFrame != null) sb.append(".").append(emotionFrame);
            sb.append("&");
        }

        if (wmotion != null) {
            sb.append("wmotion=").append(wmotion);
            sb.append("&");
        }

        String url = sb.toString();
        if (url.endsWith("&") || url.endsWith("?")) {
            url = url.substring(0, url.length() - 1);
        }

        return url;
    }
}

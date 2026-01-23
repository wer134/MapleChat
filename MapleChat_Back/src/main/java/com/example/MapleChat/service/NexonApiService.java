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
}

package com.example.MapleChat.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.MapleChat.dto.character.CharacterAbility;
import com.example.MapleChat.dto.character.CharacterBasicInfo;
import com.example.MapleChat.dto.character.CharacterBeautyEquipment;
import com.example.MapleChat.dto.character.CharacterCashItemEquipment;
import com.example.MapleChat.dto.character.CharacterHyperStat;
import com.example.MapleChat.dto.character.CharacterItemEquipment;
import com.example.MapleChat.dto.character.CharacterOcid;
import com.example.MapleChat.dto.character.CharacterPopularity;
import com.example.MapleChat.dto.character.CharacterPropensity;
import com.example.MapleChat.dto.character.CharacterSetEffect;
import com.example.MapleChat.dto.character.CharacterStat;
import com.example.MapleChat.dto.character.CharacterSymbolEquipment;

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

    public CharacterAbility getAbility(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/ability")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterAbility.class).block();
    }
    public CharacterAbility getAbilityByName(String name) {
        return getAbility(getId(name).getCharacterOcid());
    }

    public CharacterPropensity getPropensity(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/propensity")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterPropensity.class).block();
    }
    public CharacterPropensity getPropensityByName(String name) {
        return getPropensity(getId(name).getCharacterOcid());
    }

    public CharacterStat getStat(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/stat")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterStat.class).block();
    }
    public CharacterStat getStatByName(String name) {
        return getStat(getId(name).getCharacterOcid());
    }

    public CharacterHyperStat getHyperStat(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/hyper-stat")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterHyperStat.class).block();
    }
    public CharacterHyperStat getHyperStatByName(String name) {
        return getHyperStat(getId(name).getCharacterOcid());
    }

    public CharacterItemEquipment getEquipment(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/item-equipment")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterItemEquipment.class).block();

    }
    public CharacterItemEquipment getEquipmentByName(String name) {
        return getEquipment(getId(name).getCharacterOcid());
    }

    public CharacterCashItemEquipment getCashEquipment(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/cashitem-equipment")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterCashItemEquipment.class).block();

    }
    public CharacterCashItemEquipment getCashEquipmentByName(String name) {
        return getCashEquipment(getId(name).getCharacterOcid());
    }

    public CharacterSymbolEquipment getSymbol(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/symbol-equipment")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterSymbolEquipment.class).block();
    }
    public CharacterSymbolEquipment getSymbolByName(String name) { 
        return getSymbol(getId(name).getCharacterOcid());
    }

    public CharacterSetEffect getSetEffect(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/set-effect")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterSetEffect.class).block();
    }
    public CharacterSetEffect getSetEffectByName(String name) {
        return getSetEffect(getId(name).getCharacterOcid());
    }

    public CharacterBeautyEquipment getBeautyEquipment(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/beauty-equipment")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterBeautyEquipment.class).block();
    }
    public CharacterBeautyEquipment getBeautyEquipmentByName(String name) {
        return getBeautyEquipment(getId(name).getCharacterOcid());
    }
}

package com.example.MapleChat.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.MapleChat.dto.character.*;
import com.example.MapleChat.dto.guild.*;
import com.example.MapleChat.dto.union.*;
import com.example.MapleChat.exception.NexonApiException;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Service
public class NexonApiService {

    private final WebClient webClient;
    private final Map<String, String> ocidCache = new ConcurrentHashMap<>();

    public NexonApiService(
            @Value("${nexon.api-key}") String apiKey,
            @Value("${nexon.api-url:https://open.api.nexon.com}") String apiUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("x-nxopen-api-key", apiKey)
                .build();
    }

    private <T> T fetch(String path, Class<T> clazz, Object... query) {
        try {
            return webClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path(path);
                    for (int i = 0; i < query.length; i += 2) {
                        uriBuilder.queryParam(query[i].toString(), query[i + 1]);
                    }
                    return uriBuilder.build();
                })
                .retrieve()
                .onStatus(s -> s.value() == 429,
                        r -> Mono.error(new RuntimeException("RATE_LIMIT")))
                .bodyToMono(clazz)
                .block();
        } catch (NexonApiException e) {
            throw e;
        } catch (Exception e) {
            String msg = e.getMessage();
            if (msg != null && msg.contains("RATE_LIMIT")) {
                log.warn("넥슨 API 요청 한도 초과: {}", path);
                throw new NexonApiException("넥슨 API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.", HttpStatus.TOO_MANY_REQUESTS);
            }
            log.error("넥슨 API 호출 실패: {} | {}: {}", path, e.getClass().getSimpleName(), e.getMessage());
            throw new NexonApiException("넥슨 API 호출에 실패했습니다: " + path, HttpStatus.BAD_GATEWAY);
        }
    }

    private String getOcid(String name) {
        return ocidCache.computeIfAbsent(name, n -> {
            log.info("OCID 조회: {}", n);
            CharacterOcid id = fetch("/maplestory/v1/id", CharacterOcid.class,
                    "character_name", n);
            if (id == null || id.getCharacterOcid() == null) {
                log.warn("캐릭터 없음: {}", n);
                throw new NexonApiException("캐릭터를 찾을 수 없습니다: " + n, HttpStatus.NOT_FOUND);
            }
            log.debug("OCID 캐시 저장: {} -> {}", n, id.getCharacterOcid());
            return id.getCharacterOcid();
        });
    }

    public CharacterBasicInfo getBasicByName(String name) {
        return fetch("/maplestory/v1/character/basic", CharacterBasicInfo.class,
                "ocid", getOcid(name));
    }

    public CharacterPopularity getPopularityByName(String name) {
        return fetch("/maplestory/v1/character/popularity", CharacterPopularity.class,
                "ocid", getOcid(name));
    }

    public CharacterAbility getAbilityByName(String name) {
        return fetch("/maplestory/v1/character/ability", CharacterAbility.class,
                "ocid", getOcid(name));
    }

    public CharacterPropensity getPropensityByName(String name) {
        return fetch("/maplestory/v1/character/propensity", CharacterPropensity.class,
                "ocid", getOcid(name));
    }

    public CharacterStat getStatByName(String name) {
        return fetch("/maplestory/v1/character/stat", CharacterStat.class,
                "ocid", getOcid(name));
    }

    public CharacterHyperStat getHyperStatByName(String name) {
        return fetch("/maplestory/v1/character/hyper-stat", CharacterHyperStat.class,
                "ocid", getOcid(name));
    }

    public CharacterItemEquipment getEquipmentByName(String name) {
        return fetch("/maplestory/v1/character/item-equipment", CharacterItemEquipment.class,
                "ocid", getOcid(name));
    }

    public CharacterCashItemEquipment getCashEquipmentByName(String name) {
        return fetch("/maplestory/v1/character/cashitem-equipment", CharacterCashItemEquipment.class,
                "ocid", getOcid(name));
    }

    public CharacterSymbolEquipment getSymbolByName(String name) {
        return fetch("/maplestory/v1/character/symbol-equipment", CharacterSymbolEquipment.class,
                "ocid", getOcid(name));
    }

    public CharacterSetEffect getSetEffectByName(String name) {
        return fetch("/maplestory/v1/character/set-effect", CharacterSetEffect.class,
                "ocid", getOcid(name));
    }

    public CharacterBeautyEquipment getBeautyEquipmentByName(String name) {
        return fetch("/maplestory/v1/character/beauty-equipment", CharacterBeautyEquipment.class,
                "ocid", getOcid(name));
    }

    public CharacterAndroidEquipment getAndroidEquipmentByName(String name) {
        return fetch("/maplestory/v1/character/android-equipment", CharacterAndroidEquipment.class,
                "ocid", getOcid(name));
    }

    public CharacterPetEquipment getPetEquipmentByName(String name) {
        return fetch("/maplestory/v1/character/pet-equipment", CharacterPetEquipment.class,
                "ocid", getOcid(name));
    }

    public CharacterSkill getSkillByName(String name) {
        return fetch("/maplestory/v1/character/skill", CharacterSkill.class,
                "ocid", getOcid(name));
    }

    public CharacterLinkSkill getLinkSkillByName(String name) {
        return fetch("/maplestory/v1/character/link-skill", CharacterLinkSkill.class,
                "ocid", getOcid(name));
    }

    public CharacterVMatrix getVMatrixByName(String name) {
        return fetch("/maplestory/v1/character/vmatrix", CharacterVMatrix.class,
                "ocid", getOcid(name));
    }

    public CharacterHexaMatrix getHexaMatrixByName(String name) {
        return fetch("/maplestory/v1/character/hexamatrix", CharacterHexaMatrix.class,
                "ocid", getOcid(name));
    }

    public CharacterHexaMatrixStat getHexaMatrixStatByName(String name) {
        return fetch("/maplestory/v1/character/hexamatrix-stat", CharacterHexaMatrixStat.class,
                "ocid", getOcid(name));
    }

    public CharacterDojang getDojangByName(String name) {
        return fetch("/maplestory/v1/character/dojang", CharacterDojang.class,
                "ocid", getOcid(name));
    }

    public RingExhangeSkillEquipment getRingExhangeSkillEquipmentByName(String name) {
        return fetch("/maplestory/v1/character/ring-exchange-skill-equipment", RingExhangeSkillEquipment.class,
                "ocid", getOcid(name));
    }

    public Union getUnionByName(String name) {
        return fetch("/maplestory/v1/user/union", Union.class,
                "ocid", getOcid(name));
    }

    public UnionRaider getUnionRaiderByName(String name) {
        return fetch("/maplestory/v1/user/union-raider", UnionRaider.class,
                "ocid", getOcid(name));
    }

    public UnionArtiFact getArtiFactByName(String name) {
        return fetch("/maplestory/v1/user/union-artifact", UnionArtiFact.class,
                "ocid", getOcid(name));
    }

    public UnionChampion getChampionByName(String name) {
        return fetch("/maplestory/v1/user/union-champion", UnionChampion.class,
                "ocid", getOcid(name));
    }

    public GuildBasic getGuildBasicByName(String guildName, String worldName) {
        GuildID guildId = fetch("/maplestory/v1/guild/id", GuildID.class,
                "guild_name", guildName,
                "world_name", worldName);

        if (guildId == null || guildId.getGuildId() == null)
            return null;

        return fetch("/maplestory/v1/guild/basic", GuildBasic.class,
                "oguild_id", guildId.getGuildId());
    }

    public String buildCharacterImg(
            String hair,
            String face,
            Integer skin,
            String weapon,
            Integer weaponType,
            String cap
    ) {
        return "https://api.maplestory.gg/character" +
                "?hair=" + hair +
                "&face=" + face +
                "&skin=" + skin +
                "&weapon=" + weapon +
                "&weaponType=" + weaponType +
                "&cap=" + cap;
    }

    public String getCharacterImage(String name, String action, Integer actionFrame,
                                    String emotion, Integer emotionFrame, String wmotion) {

        CharacterBasicInfo info = getBasicByName(name);
        if (info == null) return null;

        StringBuilder sb = new StringBuilder(info.getCharacterImage());
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
            sb.append("wmotion=").append(wmotion).append("&");
        }

        String url = sb.toString();
        if (url.endsWith("&") || url.endsWith("?"))
            url = url.substring(0, url.length() - 1);

        return url;
    }
}
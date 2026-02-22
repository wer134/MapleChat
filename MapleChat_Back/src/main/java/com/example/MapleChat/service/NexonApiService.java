package com.example.MapleChat.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.MapleChat.dto.character.CharacterAbility;
import com.example.MapleChat.dto.character.CharacterAndroidEquipment;
import com.example.MapleChat.dto.character.CharacterBasicInfo;
import com.example.MapleChat.dto.character.CharacterBeautyEquipment;
import com.example.MapleChat.dto.character.CharacterCashItemEquipment;
import com.example.MapleChat.dto.character.CharacterDojang;
import com.example.MapleChat.dto.character.CharacterHexaMatrix;
import com.example.MapleChat.dto.character.CharacterHexaMatrixStat;
import com.example.MapleChat.dto.character.CharacterHyperStat;
import com.example.MapleChat.dto.character.CharacterItemEquipment;
import com.example.MapleChat.dto.character.CharacterLinkSkill;
import com.example.MapleChat.dto.character.CharacterOcid;
import com.example.MapleChat.dto.character.CharacterPetEquipment;
import com.example.MapleChat.dto.character.CharacterPopularity;
import com.example.MapleChat.dto.character.CharacterPropensity;
import com.example.MapleChat.dto.character.CharacterSetEffect;
import com.example.MapleChat.dto.character.CharacterSkill;
import com.example.MapleChat.dto.character.CharacterStat;
import com.example.MapleChat.dto.character.CharacterSymbolEquipment;
import com.example.MapleChat.dto.character.CharacterVMatrix;
import com.example.MapleChat.dto.character.RingExhangeSkillEquipment;
import com.example.MapleChat.dto.guild.GuildBasic;
import com.example.MapleChat.dto.guild.GuildID;
import com.example.MapleChat.dto.union.Union;
import com.example.MapleChat.dto.union.UnionArtiFact;
import com.example.MapleChat.dto.union.UnionChampion;
import com.example.MapleChat.dto.union.UnionRaider;

@Service
public class NexonApiService {
    private final WebClient webClient;
    private final Map<String, String> ocidCache = new ConcurrentHashMap<>();

    public NexonApiService( @Value("${nexon.api-key}") String apiKey) {
        this.webClient = WebClient.builder().baseUrl("https://open.api.nexon.com").defaultHeader("x-nxopen-api-key", apiKey).build();
    }

    private String getOcid(String name) {
        return ocidCache.computeIfAbsent(name, n -> getId(n).getCharacterOcid());
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
        return getBasic(getOcid(name));
    }

    public CharacterPopularity getPopularity(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/popularity")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterPopularity.class).block();
    }
    public CharacterPopularity getPopularityByName(String name) {
        return getPopularity(getOcid(name));
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
        return getAbility(getOcid(name));
    }

    public CharacterPropensity getPropensity(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/propensity")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterPropensity.class).block();
    }
    public CharacterPropensity getPropensityByName(String name) {
        return getPropensity(getOcid(name));
    }

    public CharacterStat getStat(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/stat")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterStat.class).block();
    }
    public CharacterStat getStatByName(String name) {
        return getStat(getOcid(name));
    }

    public CharacterHyperStat getHyperStat(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/hyper-stat")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterHyperStat.class).block();
    }
    public CharacterHyperStat getHyperStatByName(String name) {
        return getHyperStat(getOcid(name));
    }

    public CharacterItemEquipment getEquipment(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/item-equipment")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterItemEquipment.class).block();

    }
    public CharacterItemEquipment getEquipmentByName(String name) {
        return getEquipment(getOcid(name));
    }

    public CharacterCashItemEquipment getCashEquipment(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/cashitem-equipment")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterCashItemEquipment.class).block();

    }
    public CharacterCashItemEquipment getCashEquipmentByName(String name) {
        return getCashEquipment(getOcid(name));
    }

    public CharacterSymbolEquipment getSymbol(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/symbol-equipment")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterSymbolEquipment.class).block();
    }
    public CharacterSymbolEquipment getSymbolByName(String name) { 
        return getSymbol(getOcid(name));
    }

    public CharacterSetEffect getSetEffect(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/set-effect")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterSetEffect.class).block();
    }
    public CharacterSetEffect getSetEffectByName(String name) {
        return getSetEffect(getOcid(name));
    }

    public CharacterBeautyEquipment getBeautyEquipment(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/beauty-equipment")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterBeautyEquipment.class).block();
    }
    public CharacterBeautyEquipment getBeautyEquipmentByName(String name) {
        return getBeautyEquipment(getOcid(name));
    }

    public CharacterAndroidEquipment getAndroidEquipment(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/android-equipment")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterAndroidEquipment.class).block();
    }
    public CharacterAndroidEquipment getAndroidEquipmentByName(String name) {
        return getAndroidEquipment(getOcid(name));
    }

    public CharacterPetEquipment getPetEquipment(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/pet-equipment")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterPetEquipment.class).block();
    }
    public CharacterPetEquipment getPetEquipmentByName(String name) {
        return getPetEquipment(getOcid(name));
    }

    public CharacterSkill getSkill(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/skill")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterSkill.class).block();
    }
    public CharacterSkill getSkillByName(String name) {
        return getSkill(getOcid(name));
    }

    public CharacterLinkSkill getLinkSkill(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/link-skill")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterLinkSkill.class).block();
    }
    public CharacterLinkSkill getLinkSkillByName(String name) {
        return getLinkSkill(getOcid(name));
    }

    public CharacterVMatrix getVMatrix(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/vmatrix")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterVMatrix.class).block();
    }
    public CharacterVMatrix getVMatrixByName(String name) {
        return getVMatrix(getOcid(name));
    }

    public CharacterHexaMatrix getHexaMatrix(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/hexamatrix")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterHexaMatrix.class).block();
    }
    public CharacterHexaMatrix getHexaMatrixByName(String name) {
        return getHexaMatrix(getOcid(name));
    }

    public CharacterHexaMatrixStat getHexaMatrixStat(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/hexamatrix-stat")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterHexaMatrixStat.class).block();
    }
    public CharacterHexaMatrixStat getHexaMatrixStatByName(String name) {
        return getHexaMatrixStat(getOcid(name));
    }

    public CharacterDojang getDojang(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/dojang")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(CharacterDojang.class).block();
    }
    public CharacterDojang getDojangByName(String name) {
        return getDojang(getOcid(name));
    }

    public RingExhangeSkillEquipment getRingExhangeSkillEquipment(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/character/ring-exchange-skill-equipment")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(RingExhangeSkillEquipment.class).block();
    }
    public RingExhangeSkillEquipment getRingExhangeSkillEquipmentByName(String name) {
        return getRingExhangeSkillEquipment(getOcid(name));
    }

    public Union getUnion(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/user/union")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(Union.class).block();
    }
    public Union getUnionByName(String name) {
        return getUnion(getOcid(name));
    }   

    public UnionRaider getUnionRaider(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/user/union-raider")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(UnionRaider.class).block();
    }
    public UnionRaider getUnionRaiderByName(String name) {
        return getUnionRaider(getOcid(name));
    }

    public UnionArtiFact getUnionArtiFact(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/user/union-artifact")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(UnionArtiFact.class).block();
    }
    public UnionArtiFact getArtiFactByName(String name) {
        return getUnionArtiFact(getOcid(name));
    }

    public UnionChampion getChampion(String ocid) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/user/union-champion")
                .queryParam("ocid", ocid)
                .build()).retrieve().bodyToMono(UnionChampion.class).block();
    }
    public UnionChampion getChampionByName(String name) {
        return getChampion(getOcid(name));
    }

    public GuildID getGuildID(String guildName, String worldName) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/guild/id")
                .queryParam("guild_name", guildName)
                .queryParam("world_name", worldName)
                .build()).retrieve().bodyToMono(GuildID.class).block();
    }

    public GuildBasic getGuildBasic(String guildId) {
        return webClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/maplestory/v1/guild/basic")
                .queryParam("oguild_id", guildId) 
                .build()).retrieve().bodyToMono(GuildBasic.class).block();
    }

    public GuildBasic getGuildBasicByName(String guildName, String worldName) { 
        GuildID guildId = getGuildID(guildName, worldName);

        if (guildId == null || guildId.getGuildId() == null) {
            return null;
        }

        return getGuildBasic(guildId.getGuildId());
    }
}


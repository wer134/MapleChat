package com.example.MapleChat.dto.character;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

// 기본 정보
@Data
public class CharacterBasicInfo {
    @JsonProperty("character_name")
    private String characterName;

    @JsonProperty("world_name")
    private String worldName;

    @JsonProperty("character_class")
    private String characterClass;

    @JsonProperty("character_level")
    private int characterLevel;

    @JsonProperty("character_image")
    private String characterImage;

    @JsonProperty("guild_name")
    @JsonAlias("character_guild_name")
    private String guildName;
}
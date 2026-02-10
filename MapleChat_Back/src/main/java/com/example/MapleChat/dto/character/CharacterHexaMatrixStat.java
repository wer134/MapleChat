package com.example.MapleChat.dto.character;

import java.util.List;

import com.example.MapleChat.dto.character.skills.hexaMatrix.HexaStatCore;
import com.example.MapleChat.dto.character.skills.hexaMatrix.HexaStatCorePreset;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class CharacterHexaMatrixStat {
    @JsonProperty("character_hexa_stat_core") 
    private List<HexaStatCore> hexaStatCore;

    @JsonProperty("character_hexa_stat_core_2") 
    private List<HexaStatCore> hexaStatCore2;

    @JsonProperty("character_hexa_stat_core_3") 
    private List<HexaStatCore> hexaStatCore3;

    @JsonProperty("preset_hexa_stat_core") 
    private List<HexaStatCorePreset> presetHexaStatCore;

    @JsonProperty("preset_hexa_stat_core_2") 
    private List<HexaStatCorePreset> presetHexaStatCore2;

    @JsonProperty("preset_hexa_stat_core_3") 
    private List<HexaStatCorePreset> presetHexaStatCore3;
}

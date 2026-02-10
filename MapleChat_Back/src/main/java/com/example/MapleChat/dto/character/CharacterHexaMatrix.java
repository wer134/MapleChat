package com.example.MapleChat.dto.character;

import java.util.List;

import com.example.MapleChat.dto.character.skills.hexaMatrix.HexaCoreEquipment;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class CharacterHexaMatrix {
    @JsonProperty("character_hexa_core_equipment") 
    private List<HexaCoreEquipment> hexaCoreEquipment;
}

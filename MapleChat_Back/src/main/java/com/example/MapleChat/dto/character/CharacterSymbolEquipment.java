package com.example.MapleChat.dto.character;

import java.util.List;

import com.example.MapleChat.dto.character.equipment.symbolEquipment.Symbol;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CharacterSymbolEquipment {
    @JsonProperty("character_class")    
    private String characterClass;

    @JsonProperty("symbol")
    private List<Symbol> symbol;
}

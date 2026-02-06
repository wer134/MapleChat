package com.example.MapleChat.dto.character.Equipment.PetEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ItemOption {
    @JsonProperty("option_type")    
    private String optionType;

    @JsonProperty("option_value")
    private String optionValue;
}

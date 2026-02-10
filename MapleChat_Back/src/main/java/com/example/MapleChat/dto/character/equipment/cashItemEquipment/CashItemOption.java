package com.example.MapleChat.dto.character.equipment.cashItemEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CashItemOption {
    @JsonProperty("option_type")    
    private String optionType;

    @JsonProperty("option_value")
    private String optionValue;
}

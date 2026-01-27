package com.example.MapleChat.dto.character.Equipment.CashItemEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CashItemColoringPrism {
    @JsonProperty("color_range")
    private String colorRange;
    
    @JsonProperty("hue")
    private Long hue;

    @JsonProperty("saturation")
    private Long saturation;

    @JsonProperty("value")
    private Long value;
}
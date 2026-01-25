package com.example.MapleChat.dto.character.cashItemEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CashItemPrism {
    @JsonProperty("color_range")
    private String colorRange;
    
    @JsonProperty("hue")
    private Long hue;

    @JsonProperty("saturation")
    private Long saturation;

    @JsonProperty("value")
    private Long value;
}
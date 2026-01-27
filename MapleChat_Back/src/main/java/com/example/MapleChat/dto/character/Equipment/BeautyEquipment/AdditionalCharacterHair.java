package com.example.MapleChat.dto.character.Equipment.BeautyEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AdditionalCharacterHair {
    @JsonProperty("hair_name")    
    private String hairName;

    @JsonProperty("base_color")
    private String baseColor;

    @JsonProperty("mix_color")
    private String mixColor;

    @JsonProperty("mix_rate")
    private String mixRate;

    @JsonProperty("freestyle_flag")
    private String freestyleFlag;
}

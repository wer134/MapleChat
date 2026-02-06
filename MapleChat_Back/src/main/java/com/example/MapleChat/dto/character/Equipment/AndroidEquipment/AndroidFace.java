package com.example.MapleChat.dto.character.Equipment.AndroidEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AndroidFace {
    @JsonProperty("face_name")    
    private String faceName;

    @JsonProperty("base_color")
    private String baseColor;

    @JsonProperty("mix_color")
    private String mixColor;

    @JsonProperty("mix_rate")
    private String mixRate;

    @JsonProperty("freestyle_flag")
    private String freeStyleFlag;
}

package com.example.MapleChat.dto.character.Equipment.AndroidEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AndroidSkin {
    @JsonProperty("skin_name")    
    private String skinName;

    @JsonProperty("color_style")
    private String colorStyle;

    @JsonProperty("hue")
    private Long hue;

    @JsonProperty("saturation")
    private Long saturation;

    @JsonProperty("brightness")
    private Long brightNess;;
}

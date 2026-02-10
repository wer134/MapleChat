package com.example.MapleChat.dto.character.effect.setEffect;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SetOptionFull {
    @JsonProperty("set_count") 
    private Long setCount;

    @JsonProperty("set_option")
    private String setOption;
}

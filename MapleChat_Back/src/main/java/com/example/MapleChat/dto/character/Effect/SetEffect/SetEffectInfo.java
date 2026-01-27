package com.example.MapleChat.dto.character.Effect.SetEffect;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SetEffectInfo {
    @JsonProperty("set_count") 
    private Long setCount;

    @JsonProperty("set_option")
    private String setOption;
}

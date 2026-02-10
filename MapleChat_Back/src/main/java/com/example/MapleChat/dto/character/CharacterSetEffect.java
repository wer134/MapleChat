package com.example.MapleChat.dto.character;

import java.util.List;

import com.example.MapleChat.dto.character.effect.setEffect.SetEffectInfo;
import com.example.MapleChat.dto.character.effect.setEffect.SetOptionFull;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CharacterSetEffect {
    @JsonProperty("set_name")
    private String setName;

    @JsonProperty("total_set_count")
    private Long totalSetCount;

    @JsonProperty("set_effect_info")
    private List<SetEffectInfo> setEffectInfo;

    @JsonProperty("set_option_full")
    private List<SetOptionFull> setOptionFull;
}

package com.example.MapleChat.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CharacterHyperStat {
    @JsonProperty("use_preset_no")
    private String usePresetNo;

    @JsonProperty("hyper_stat_preset_1")
    private List<HyperStatPreset> hyperStatPreset1;

    @JsonProperty("hyper_stat_preset_2")
    private List<HyperStatPreset> hyperStatPreset2;

    @JsonProperty("hyper_stat_preset_3")
    private List<HyperStatPreset> hyperStatPreset3;

    @Data
    public static class HyperStatPreset {
        @JsonProperty("stat_type")
        // 스탯 종류
        private String statType;

        @JsonProperty("stat_level")
        private Long statLevel;
    }
}

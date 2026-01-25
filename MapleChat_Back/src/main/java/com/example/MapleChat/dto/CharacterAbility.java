package com.example.MapleChat.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

// 어빌리티
@Data
public class CharacterAbility {
    @JsonProperty("ability_grade")
    private String abilityGrade;

    @JsonProperty("ability_info")
    private List<AbilityInfo> abilityInfo;

    @JsonProperty("preset_no")
    private Long presetNo;

    @JsonProperty("ability_preset_1")
    private AbilityPreset abilityPreset1;

    @JsonProperty("ability_preset_2")
    private AbilityPreset abilityPreset2;

    @JsonProperty("ability_preset_3")
    private AbilityPreset abilityPreset3;

    @Data
    public static class AbilityInfo {
        @JsonProperty("ability_no")    
        private String abilityNo;

        @JsonProperty("ability_grade")
        private String abilityGrade;

        @JsonProperty("ability_value")
        private String abilityValue;
    }

    @Data
    public static class AbilityPreset {
        @JsonProperty("ability_preset_grade")
        private String abilityPresetGrade;

        @JsonProperty("ability_info")
        private List<AbilityInfo> abilityInfo;
    }
}

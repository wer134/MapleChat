package com.example.MapleChat.dto.character.skills.hexaMatrix;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class HexaStatCorePreset {
    @JsonProperty("slot_id") 
    private String slotId;

    @JsonProperty("main_stat_name") 
    private String mainStatName;

    @JsonProperty("sub_stat_name_1") 
    private String subStatName1;

    @JsonProperty("sub_stat_name_2") 
    private String subStatName2;

    @JsonProperty("main_stat_level") 
    private Long mainStatLevel;

    @JsonProperty("sub_stat_level_1") 
    private Long subStatLevel1;

    @JsonProperty("sub_stat_level_2") 
    private Long subStatLevel2;

    @JsonProperty("stat_grade") 
    private Long statGrade;
}

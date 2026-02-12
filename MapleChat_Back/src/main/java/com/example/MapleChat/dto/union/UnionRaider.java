package com.example.MapleChat.dto.union;

import java.util.List;

import com.example.MapleChat.dto.union.unionRaider.UnionBlock;
import com.example.MapleChat.dto.union.unionRaider.UnionInnerStat;
import com.example.MapleChat.dto.union.unionRaider.UnionRaiderPreset;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class UnionRaider {
    @JsonProperty("union_raider_stat") 
    private List<String> unionRaiderStat;

    @JsonProperty("union_occupied_stat")
    private List<String> unionOccuipedStat;

    @JsonProperty("union_inner_stat")
    private List<UnionInnerStat> unionInnerStat;

    @JsonProperty("union_block")
    private List<UnionBlock> unionBlock;

    @JsonProperty("use_preset_no")
    private Long usePresetNo;

    @JsonProperty("union_raider_preset_1")
    private UnionRaiderPreset unionRaiderPreset1;

    @JsonProperty("union_raider_preset_2")
    private UnionRaiderPreset unionRaiderPreset2;

    @JsonProperty("union_raider_preset_3")
    private UnionRaiderPreset unionRaiderPreset3;

    @JsonProperty("union_raider_preset_4")
    private UnionRaiderPreset unionRaiderPreset4;

    @JsonProperty("union_raider_preset_5")
    private UnionRaiderPreset unionRaiderPreset5;
}

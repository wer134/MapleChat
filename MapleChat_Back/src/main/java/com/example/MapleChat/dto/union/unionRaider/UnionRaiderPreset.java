package com.example.MapleChat.dto.union.unionRaider;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class UnionRaiderPreset {
    @JsonProperty("union_raider_stat")
    private List<String> unionRaiderStat;

    @JsonProperty("union_occuiped_stat")
    private List<String> unionOccuipedStat;

    @JsonProperty("union_inner_stat") 
    private List<UnionInnerStat> unionInnerStat;

    @JsonProperty("union_block")
    private List<UnionBlock> unionBlock;
}

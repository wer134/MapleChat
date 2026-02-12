package com.example.MapleChat.dto.union.unionRaider;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class UnionInnerStat {
    @JsonProperty("stat_field_id")
    private String statFieldId;

    @JsonProperty("stat_field_effect")
    private String statFieldEffect;
}

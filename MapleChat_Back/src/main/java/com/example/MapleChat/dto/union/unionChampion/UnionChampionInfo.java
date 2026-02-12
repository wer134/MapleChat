package com.example.MapleChat.dto.union.unionChampion;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class UnionChampionInfo {
    @JsonProperty("champion_name") 
    private String championName;

    @JsonProperty("champion_slot")
    private Long championSlot;

    @JsonProperty("champion_grade")
    private String championGrade;

    @JsonProperty("champion_class")
    private String championClass;
}

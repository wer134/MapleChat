package com.example.MapleChat.dto.union;

import java.util.List;

import com.example.MapleChat.dto.union.unionChampion.UnionChampionInfo;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class UnionChampion {
    @JsonProperty("union_champion") 
    private List<UnionChampionInfo> unionChampionInfo;
}

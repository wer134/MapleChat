package com.example.MapleChat.dto.union.unionArtifact;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class UnionArtifactEffect {
    @JsonProperty("name") 
    private String name;

    @JsonProperty("level")
    private Long level;
}

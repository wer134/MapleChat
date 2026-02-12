package com.example.MapleChat.dto.union;

import java.util.List;

import com.example.MapleChat.dto.union.unionArtifact.UnionArtifactCrystal;
import com.example.MapleChat.dto.union.unionArtifact.UnionArtifactEffect;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class UnionArtiFact {
    @JsonProperty("union_artifact_effect")
    private List<UnionArtifactEffect> unionArtifactEffect;

    @JsonProperty("union_artifact_crystal")
    private List<UnionArtifactCrystal> unionArtifactCrystal;
}

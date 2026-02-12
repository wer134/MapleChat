package com.example.MapleChat.dto.union;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Union {
    @JsonProperty("union_level") 
    private Long unionLevel;

    @JsonProperty("union_grade")
    private String unionGrade;

    @JsonProperty("union_artifact_level")
    private String unionArtifactLevel;
}

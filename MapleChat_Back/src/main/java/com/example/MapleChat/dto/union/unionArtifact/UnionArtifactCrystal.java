package com.example.MapleChat.dto.union.unionArtifact;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class UnionArtifactCrystal {
    @JsonProperty("name")
    private String name;

    @JsonProperty("validity_flag")
    private String validityFlag;

    @JsonProperty("date_expire")
    private String dateExpire;

    @JsonProperty("level")
    private Long level;

    @JsonProperty("crystal_option_name_1")
    private String cryStalOptionName1;

    @JsonProperty("crystal_option_name_2")
    private String cryStalOptionName2;

    @JsonProperty("crystal_option_name_3")
    private String cryStalOptionName3;
}

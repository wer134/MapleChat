package com.example.MapleChat.dto.character;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class CharacterDojang {
    @JsonProperty("dojang_best_floor") 
    private Long dojangBestFloor;

    @JsonProperty("date_dojang_record")
    private String dateDojangRecord;

    @JsonProperty("date_best_time")
    private Long dateBestTime;
}

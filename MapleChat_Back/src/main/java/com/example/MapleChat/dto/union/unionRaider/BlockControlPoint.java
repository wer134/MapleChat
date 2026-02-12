package com.example.MapleChat.dto.union.unionRaider;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class BlockControlPoint {
    @JsonProperty("x") 
    private Long x;

    @JsonProperty("y") 
    private Long y;
}

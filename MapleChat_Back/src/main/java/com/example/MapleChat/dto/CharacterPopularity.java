package com.example.MapleChat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CharacterPopularity {
    @JsonProperty("popularity")
    private int characterPopularity;
}

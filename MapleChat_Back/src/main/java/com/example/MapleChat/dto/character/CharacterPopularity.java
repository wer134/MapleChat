package com.example.MapleChat.dto.character;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

// 인기도 정보
@Data
public class CharacterPopularity {
    @JsonProperty("popularity")
    private int characterPopularity;
}

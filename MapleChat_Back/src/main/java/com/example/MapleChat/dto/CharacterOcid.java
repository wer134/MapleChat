package com.example.MapleChat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

// 캐릭터 식별자
@Data
public class CharacterOcid {
    @JsonProperty("ocid") 
    private String characterOcid;
}

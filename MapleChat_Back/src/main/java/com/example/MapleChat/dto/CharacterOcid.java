package com.example.MapleChat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CharacterOcid {
    @JsonProperty("ocid") 
    private String characterOcid;
}

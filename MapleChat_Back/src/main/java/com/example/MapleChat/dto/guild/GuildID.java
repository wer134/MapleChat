package com.example.MapleChat.dto.guild;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GuildID {
    @JsonProperty("oguild_id") 
    private String guildId;
}

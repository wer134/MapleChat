package com.example.MapleChat.dto.character;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

// 성향 정보
@Data
public class CharacterPropensity {
    @JsonProperty("charisma_level")    
    private Long charismaLevel;

    @JsonProperty("sensibility_level")
    private Long sensibilityLevel;

    @JsonProperty("insight_level")
    private Long insightLevel;

    @JsonProperty("willingness_level")
    private Long willingnessLevel;

    @JsonProperty("handicraft_level")
    private Long handicraftLevel;

    @JsonProperty("charm_level")
    private Long charmLevel;
}
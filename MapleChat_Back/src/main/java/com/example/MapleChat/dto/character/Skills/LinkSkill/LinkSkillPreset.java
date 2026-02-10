package com.example.MapleChat.dto.character.Skills.LinkSkill;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class LinkSkillPreset {
    @JsonProperty("skill_name")    
    private String skillName;

    @JsonProperty("skill_description")    
    private String skillDescription;

    @JsonProperty("skill_level")    
    private Long skillLevel;

    @JsonProperty("skill_effect")    
    private String skillEffect;

    @JsonProperty("skill_icon")    
    private String skillIcon;
}

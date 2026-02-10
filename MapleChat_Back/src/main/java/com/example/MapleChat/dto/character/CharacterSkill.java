package com.example.MapleChat.dto.character;

import java.util.List;

import com.example.MapleChat.dto.character.skills.skill.SkillInfo;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CharacterSkill {
    @JsonProperty("character_class")    
    private String characterClass;

    @JsonProperty("character_skill_grade")
    private String characterSkillGrade;

    @JsonProperty("character_skill")
    private List<SkillInfo> characterSkill;
}

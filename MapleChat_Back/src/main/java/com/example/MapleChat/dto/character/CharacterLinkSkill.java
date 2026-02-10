package com.example.MapleChat.dto.character;

import java.util.List;

import com.example.MapleChat.dto.character.skills.linkSkill.LinkSkill;
import com.example.MapleChat.dto.character.skills.linkSkill.LinkSkillPreset;
import com.example.MapleChat.dto.character.skills.linkSkill.OwnedLinkSkill;
import com.example.MapleChat.dto.character.skills.linkSkill.OwnedLinkSkillPreset;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CharacterLinkSkill {
    @JsonProperty("character_link_skill")    
    private List<LinkSkill> linkSkill;

    @JsonProperty("character_link_skill_preset_1")
    private List<LinkSkillPreset> linkSkillPreset1;
    
    @JsonProperty("character_link_skill_preset_2")
    private List<LinkSkillPreset> linkSkillPreset2;

    @JsonProperty("character_link_skill_preset_3")
    private List<LinkSkillPreset> linkSkillPreset3;

    @JsonProperty("character_owned_link_skill")
    private OwnedLinkSkill ownedLinkSkill;

    @JsonProperty("character_owned_link_skill_preset_1")
    private OwnedLinkSkillPreset ownedLinkSkillPreset1;

    @JsonProperty("character_owned_link_skill_preset_2")
    private OwnedLinkSkillPreset ownedLinkSkillPreset2;

    @JsonProperty("character_owned_link_skill_preset_3")
    private OwnedLinkSkillPreset ownedLinkSkillPreset3;
}

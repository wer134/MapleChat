package com.example.MapleChat.dto.character.skills.hexaMatrix;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class HexaCoreEquipment {
    @JsonProperty("hexa_core_name") 
    private String hexaCoreName;

    @JsonProperty("hexa_core_level")
    private Long hexaCoreLevel;

    @JsonProperty("hexa_core_type")
    private String hexaCoreType;

    @JsonProperty("linked_skill")
    private List<HexaSkillID> linkedSkill;

    @Data
    public static class HexaSkillID {
        @JsonProperty("hexa_skill_id")
        private String hexaSkillId;
    }
}

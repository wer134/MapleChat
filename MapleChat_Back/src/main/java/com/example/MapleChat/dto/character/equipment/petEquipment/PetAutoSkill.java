package com.example.MapleChat.dto.character.equipment.petEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PetAutoSkill {
    @JsonProperty("skill_1")    
    private String skill1;

    @JsonProperty("skill_1_icon")
    private String skill1Icon;

    @JsonProperty("skill_2")
    private String skill2;

    @JsonProperty("skill_2_icon")
    private String skill2Icon;
}

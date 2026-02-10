package com.example.MapleChat.dto.character.skills.vMatrix;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class VcoreEquipment {
    @JsonProperty("slot_id")    
    private String slotId;

    @JsonProperty("v_core_name")
    private String vcoreName;

    @JsonProperty("v_core_type")
    private String vcoreType;

    @JsonProperty("v_core_level")
    private Long vcoreLevel;
}

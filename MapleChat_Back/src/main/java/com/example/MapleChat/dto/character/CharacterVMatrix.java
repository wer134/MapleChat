package com.example.MapleChat.dto.character;

import java.util.List;

import com.example.MapleChat.dto.character.skills.vMatrix.VcoreEquipment;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CharacterVMatrix {
    @JsonProperty("character_v_core_equipment")
    private List<VcoreEquipment> vcoreEquipment;

    @JsonProperty("character_v_matrix_remain_slot_upgrade_point")
    private Long characterVMatrixRemainSlotUpgradePoint;
}

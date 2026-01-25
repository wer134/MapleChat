package com.example.MapleChat.dto.character;

import java.util.List;

import com.example.MapleChat.dto.character.itemEquipment.DragonEquipment;
import com.example.MapleChat.dto.character.itemEquipment.ItemEquipment;
import com.example.MapleChat.dto.character.itemEquipment.ItemEquipmentPreset;
import com.example.MapleChat.dto.character.itemEquipment.MechanicEquipment;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CharacterItemEquipment {
    @JsonProperty("preset_no")    
    private Long presetNo;

    @JsonProperty("item_equipment")
    private List<ItemEquipment> itemEquipment;

    @JsonProperty("item_equipment_preset_1")
    private List<ItemEquipmentPreset> itemEquipmentPreset1;

    @JsonProperty("item_equipment_preset_2")
    private List<ItemEquipmentPreset> itemEquipmentPreset2;

    @JsonProperty("item_equipment_preset_3")
    private List<ItemEquipmentPreset> itemEquipmentPreset3;

    @JsonProperty("dragon_equipment")
    private List<DragonEquipment> dragonEquipment;

    @JsonProperty("mechanic_equipment")
    private List<MechanicEquipment> mechanicEquipment;
}

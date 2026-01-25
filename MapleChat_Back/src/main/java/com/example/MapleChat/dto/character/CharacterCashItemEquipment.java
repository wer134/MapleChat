package com.example.MapleChat.dto.character;

import java.util.List;

import com.example.MapleChat.dto.character.Equipment.CashItemEquipment.AdditionalCashItemEquipmentBase;
import com.example.MapleChat.dto.character.Equipment.CashItemEquipment.AdditionalCashItemEquipmentPreset;
import com.example.MapleChat.dto.character.Equipment.CashItemEquipment.CashItemEquipmentBase;
import com.example.MapleChat.dto.character.Equipment.CashItemEquipment.CashItemEquipmentPreset;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CharacterCashItemEquipment {
    @JsonProperty("character_look_mode")
    private String CharacterLookMode;

    @JsonProperty("preset_no")
    private Long presetNo;

    @JsonProperty("cash_item_equipment_base")
    private List<CashItemEquipmentBase> caseItemEquipmentBase;

    @JsonProperty("cash_item_equipment_preset_1")
    private List<CashItemEquipmentPreset> cashItemEquipmentPreset1;

    @JsonProperty("cash_item_equipment_preset_2")
    private List<CashItemEquipmentPreset> cashItemEquipmentPreset2;

    @JsonProperty("cash_item_equipment_preset_3")
    private List<CashItemEquipmentPreset> cashItemEquipmentPreset3;

    @JsonProperty("additional_cash_item_equipment_base")
    private List<AdditionalCashItemEquipmentBase> additionalCashItemEquipmentBase;

    @JsonProperty("additional_cash_item_equipment_preset_1")
    private List<AdditionalCashItemEquipmentPreset> additionalCashItemEquipmentPreset1;

    @JsonProperty("additional_cash_item_equipment_preset_2")
    private List<AdditionalCashItemEquipmentPreset> additionalCashItemEquipmentPreset2;

    @JsonProperty("additional_cash_item_equipment_preset_3")
    private List<AdditionalCashItemEquipmentPreset> additionalCashItemEquipmentPreset3;
}

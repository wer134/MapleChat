package com.example.MapleChat.dto.character.itemEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ItemEquipment {
    @JsonProperty("item_equipment_slot")
    private String itemEquipmentSlot;

    @JsonProperty("item_name")
    private String itemName;
    
    @JsonProperty("item_icon")
    private String itemIcon;

    @JsonProperty("item_shape_name")
    private String itemShapeName;

    @JsonProperty("item_shape_icon")
    private String itemShapeIcon;

    @JsonProperty("item_gender")
    private String itemGender;

    @JsonProperty("item_total_option")
    private ItemTotalOption itemTotalOption;

    @JsonProperty("item_base_option")
    private ItemBaseOption itemBaseOption;

    @JsonProperty("potential_option_flag")
    private String potentialOptionFlag;

    @JsonProperty("additional_potential_option_flag")
    private String additionalPotentialOptionFlag;

    @JsonProperty("potential_option_grade")
    private String potentialOptionGrade;

    @JsonProperty("additional_potential_option_grade")
    private String additionalPotentialOptionGrade;

    @JsonProperty("potential_option_1")
    private String potentialOption1;

    @JsonProperty("potential_option_2")
    private String potentialOption2;

    @JsonProperty("potential_option_3")
    private String potentialOption3;

    @JsonProperty("additional_potential_option_1")
    private String additionalPotentialOption1;

    @JsonProperty("additional_potential_option_2")
    private String additionalPotentialOption2;

    @JsonProperty("additional_potential_option_3")
    private String additionalPotentialOption3;

    @JsonProperty("equipment_level_increase")
    private Long equipmentLevelIncrease;

    @JsonProperty("item_exceptional_option")
    private ItemExceptionalOption itemExceptionalOption;

    @JsonProperty("item_add_option")
    private ItemAddOption itemAddOption;

    @JsonProperty("growth_exp")
    private Long growthExp;

    @JsonProperty("growth_level")
    private Long growthLevel;

    @JsonProperty("scroll_upgrade")
    private String scrollUpgrade;

    @JsonProperty("cuttable_count")
    private String cuttableCount;

    @JsonProperty("golden_hammer_flag")
    private String goldenHammerFlag;

    @JsonProperty("scroll_resilience_count")
    private String scrollResilienceCount;

    @JsonProperty("scroll_upgradable_count")
    private String scrollUpgradableCount;

    @JsonProperty("soul_name")
    private String soulName;

    @JsonProperty("soul_option")
    private String soulOption;

    @JsonProperty("item_etc_option")
    private ItemEtcOption itemEtcOption;

    @JsonProperty("starforce")
    private String starForce;

    @JsonProperty("starforce_scroll_flag")
    private String starforceScrollFlag;

    @JsonProperty("item_starforce_option")
    private ItemStarforceOption itemStarforceOption;

    @JsonProperty("special_ring_level")
    private Long specialRingLevel;

    @JsonProperty("date_expire")
    private String dateExpire;

    @JsonProperty("freestyle_flag")
    private String freestyleFlag;
}
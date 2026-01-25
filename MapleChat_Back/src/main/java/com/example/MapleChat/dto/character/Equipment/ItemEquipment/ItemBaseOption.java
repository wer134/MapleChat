package com.example.MapleChat.dto.character.Equipment.ItemEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ItemBaseOption {
    @JsonProperty("str")
    private String str;

    @JsonProperty("dex")
    private String dex;

    @JsonProperty("luk")
    private String luk;

    @JsonProperty("int")
    private String optionInt;

    @JsonProperty("max_hp")
    private String maxHp;

    @JsonProperty("max_mp")
    private String maxMp;

    @JsonProperty("attack_power")
    private String attackPower;

    @JsonProperty("magic_power")
    private String magicPower;

    @JsonProperty("armor")
    private String armor;

    @JsonProperty("speed")
    private String speed;

    @JsonProperty("jump")
    private String jump;

    @JsonProperty("boss_damage")
    private String bossDamage;

    @JsonProperty("ignore_monster_armor")
    private String ignoreMonsterArmor;

    @JsonProperty("all_stat")
    private String allStat;

    @JsonProperty("damage")
    private String damage;

    @JsonProperty("max_hp_rate")
    private String maxHpRate;
    
    @JsonProperty("max_mp_rate")
    private String maxMpRate;

    @JsonProperty("base_equipment_level")
    private Long baseEquipmentLevel;
}

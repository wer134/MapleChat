package com.example.MapleChat.dto.character.itemEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ItemTotalOption {
    @JsonProperty("str")
    private String str;

    @JsonProperty("dex")
    private String dex;

    @JsonProperty("int")
    private String optionInt;

    @JsonProperty("luk")
    private String luk;

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

    @JsonProperty("equipment_level_decrease")
    private Long equipmentLevelDecrease;

    @JsonProperty("max_hp_rate")
    private String maxHpRate;
    
    @JsonProperty("max_mp_rate")
    private String maxMpRate;
}

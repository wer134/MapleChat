package com.example.MapleChat.dto.character.Equipment.ItemEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ItemExceptionalOption {
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

    @JsonProperty("exceptional_upgrade")
    private Long exceptionalUpgrade;
}

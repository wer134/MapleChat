package com.example.MapleChat.dto.itemEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ItemStarforceOption {
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
}

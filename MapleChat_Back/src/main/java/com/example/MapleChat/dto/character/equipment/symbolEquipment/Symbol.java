package com.example.MapleChat.dto.character.equipment.symbolEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Symbol {
    @JsonProperty("symbol_name")
    private String symbolName;

    @JsonProperty("symbol_icon")
    private String symbolIcon;

    @JsonProperty("symbol_description")
    private String symbolDescription;

    @JsonProperty("symbol_other_effect_description")
    private String symbolOtherEffectDescription;

    @JsonProperty("symbol_force")
    private String symbolForce;

    @JsonProperty("symbol_level")
    private String symbolLevel;

    @JsonProperty("symbol_str")
    private String symbolStr;

    @JsonProperty("symbol_dex")
    private String symbolDex;

    @JsonProperty("symbol_int")
    private String symbolInt;

    @JsonProperty("symbol_luk")
    private String symbolLuk;

    @JsonProperty("symbol_hp")
    private String symbolHp;

    @JsonProperty("symbol_drop_rate")
    private String symbolDropRate;

    @JsonProperty("symbol_meso_rate")
    private String symbolMesoRate;

    @JsonProperty("symbol_exp_rate")
    private String symbolExpRate;

    @JsonProperty("symbol_growth_count")
    private String symbolGrowthCount;

    @JsonProperty("symbol_require_growth_count")
    private String symbolRequireGrowthCount;

}

package com.example.MapleChat.dto.character.cashItemEquipment;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CashItemEquipmentPreset {
    @JsonProperty("cash_item_equipment_slot")    
    private String cashItemEquipmentSlot;

    @JsonProperty("cash_item_name")
    private String cashItemName;

    @JsonProperty("cash_item_icon")
    private String cashItemIcon;

    @JsonProperty("cash_item_description")
    private String cashItemDescription;

    @JsonProperty("cash_item_option")
    private List<CashItemOption> cashItemOption;

    @JsonProperty("date_expire")
    private String dateExpire;

    @JsonProperty("date_option_expire")
    private String dateOptionExpire;

    @JsonProperty("cash_item_label")
    private String cashItemLabel;

    @JsonProperty("cash_item_coloring_prism")
    private List<CashItemPrism> cashItemColoringPrism;

    @JsonProperty("cash_item_effect_prism")
    private List<CashItemPrism> cashItemEffectPrism;

    @JsonProperty("item_gender")
    private String itemGender;

    @JsonProperty("skills") 
    private List<String> skills;
    
    @JsonProperty("freestyle_flag")
    private String freestyleFlag;

    @JsonProperty("emotion_name")
    private String emotionName;
}

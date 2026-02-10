package com.example.MapleChat.dto.character.equipment.petEquipment;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PetEquipment {
    @JsonProperty("item_name")    
    private String itemName;

    @JsonProperty("item_icon")
    private String itemIcon;

    @JsonProperty("item_description")
    private String itemDescription;

    @JsonProperty("item_option")
    private List<ItemOption> itemOption;

    @JsonProperty("scroll_upgrade")
    private Long scrollUpgrade;

    @JsonProperty("scroll_upgradable")
    private Long scrollUpgradable;

    @JsonProperty("item_shape")
    private String itemShape;

    @JsonProperty("item_shape_icon")
    private String itemShapeIcon;
}

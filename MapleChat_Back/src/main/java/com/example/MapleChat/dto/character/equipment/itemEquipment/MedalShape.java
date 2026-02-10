package com.example.MapleChat.dto.character.equipment.itemEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MedalShape {
    @JsonProperty("medal_shape_name")
    private String medalShapeName;

    @JsonProperty("medal_shape_icon")
    private String medalShapeIcon;

    @JsonProperty("medal_shape_description")
    private String medalShapeDescription;

    @JsonProperty("medal_shape_change_name")
    private String medalShapeChangeName;

    @JsonProperty("medal_shape_change_icon")
    private String medalShapeChangeIcon;

    @JsonProperty("medal_shape_change_description")
    private String medalShapeChangeDescription;
}

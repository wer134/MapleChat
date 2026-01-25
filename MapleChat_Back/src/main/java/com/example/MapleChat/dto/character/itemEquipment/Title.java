package com.example.MapleChat.dto.character.itemEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Title {
    @JsonProperty("title_name")
    private String titleName;

    @JsonProperty("title_icon")
    private String titleIcon;

    @JsonProperty("title_description")
    private String titleDescription;

    @JsonProperty("date_expire")
    private String dateExpire;

    @JsonProperty("date_option_expire")
    private String dateOptionExpire;

    @JsonProperty("title_shape_name") 
    private String titleShapeName;

    @JsonProperty("title_shape_icon") 
    private String titleShapeIcon;

    @JsonProperty("title_shape_description") 
    private String titleShapeDescription;
}

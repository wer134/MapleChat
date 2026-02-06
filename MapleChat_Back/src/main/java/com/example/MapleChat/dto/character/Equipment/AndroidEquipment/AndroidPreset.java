package com.example.MapleChat.dto.character.Equipment.AndroidEquipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AndroidPreset {
    @JsonProperty("android_name")
    private String androidName;

    @JsonProperty("android_nickname")
    private String androidNickname;

    @JsonProperty("android_icon")
    private String androidIcon;

    @JsonProperty("android_description")
    private String androidDescription;

    @JsonProperty("android_gender")
    private String androidGender;

    @JsonProperty("android_grade")
    private String androidGrade;

    @JsonProperty("android_skin")
    private AndroidSkin androidSkin;

    @JsonProperty("android_hair")    
    private AndroidHair androidHair;

    @JsonProperty("android_face")
    private AndroidFace androidFace;

    @JsonProperty("android_ear_sensor_clip_flag")
    private String androidEarSensorClipFlag;

    @JsonProperty("android_non_humanoid_flag")
    private String androidNonHumanoidFlag;

    @JsonProperty("android_shop_usable_flag")
    private String androidShopUsableFlag;

    @JsonProperty("preset_no")
    private Long presetNo;
}

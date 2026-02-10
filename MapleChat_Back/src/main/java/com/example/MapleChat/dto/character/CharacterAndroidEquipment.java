package com.example.MapleChat.dto.character;

import java.util.List;

import com.example.MapleChat.dto.character.equipment.androidEquipment.AndroidCashItemEquipment;
import com.example.MapleChat.dto.character.equipment.androidEquipment.AndroidFace;
import com.example.MapleChat.dto.character.equipment.androidEquipment.AndroidHair;
import com.example.MapleChat.dto.character.equipment.androidEquipment.AndroidPreset;
import com.example.MapleChat.dto.character.equipment.androidEquipment.AndroidSkin;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class CharacterAndroidEquipment {
    @JsonProperty("android_name")
    private String androidName;

    @JsonProperty("android_nickname")
    private String androidNickname;

    @JsonProperty("android_icon")
    private String androidIcon;

    @JsonProperty("android_description")
    private String androidDescription;

    @JsonProperty("android_hair")    
    private AndroidHair androidHair;

    @JsonProperty("android_face")
    private AndroidFace androidFace;

    @JsonProperty("android_skin")
    private AndroidSkin androidSkin;

    @JsonProperty("android_cash_item_equipment")
    private List<AndroidCashItemEquipment> androidCashItemEquipments;

    @JsonProperty("android_ear_sensor_clip_flag")
    private String androidEarSensorClipFlag;

    @JsonProperty("android_gender")
    private String androidGender;

    @JsonProperty("android_grade")
    private String androidGrade;

    @JsonProperty("android_non_humanoid_flag")
    private String androidNonHumanoidFlag;

    @JsonProperty("android_shop_usable_flag")
    private String androidShopUsableFlag;

    @JsonProperty("preset_no")
    private Long presetNo;

    @JsonProperty("android_preset_1")
    private AndroidPreset androidPreset1;

    @JsonProperty("android_preset_2")
    private AndroidPreset androidPreset2;

    @JsonProperty("android_preset_3")
    private AndroidPreset androidPreset3;
}

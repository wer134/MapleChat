package com.example.MapleChat.dto.character;

import com.example.MapleChat.dto.character.equipment.beautyEquipment.AdditionalCharacterFace;
import com.example.MapleChat.dto.character.equipment.beautyEquipment.AdditionalCharacterHair;
import com.example.MapleChat.dto.character.equipment.beautyEquipment.AdditionalCharacterSkin;
import com.example.MapleChat.dto.character.equipment.beautyEquipment.CharacterFace;
import com.example.MapleChat.dto.character.equipment.beautyEquipment.CharacterHair;
import com.example.MapleChat.dto.character.equipment.beautyEquipment.CharacterSkin;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CharacterBeautyEquipment {
    @JsonProperty("character_gender")    
    private String characterGender;

    @JsonProperty("character_class")
    private String characterClass;

    @JsonProperty("character_hair")
    private CharacterHair characterHair;

    @JsonProperty("character_face")
    private CharacterFace characterFace;

    @JsonProperty("character_skin")
    private CharacterSkin characterSkin;

    @JsonProperty("additional_character_hair")
    private AdditionalCharacterHair additionalCharacterHair;

    @JsonProperty("additional_character_face")
    private AdditionalCharacterFace additionalCharacterFace;

    @JsonProperty("additional_character_skin")
    private AdditionalCharacterSkin additionalCharacteSkin;
}

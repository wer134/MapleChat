package com.example.MapleChat.controller;

import com.example.MapleChat.dto.character.CharacterAbility;
import com.example.MapleChat.dto.character.CharacterBasicInfo;
import com.example.MapleChat.dto.character.CharacterCashItemEquipment;
import com.example.MapleChat.dto.character.CharacterHyperStat;
import com.example.MapleChat.dto.character.CharacterItemEquipment;
import com.example.MapleChat.dto.character.CharacterPopularity;
import com.example.MapleChat.dto.character.CharacterPropensity;
import com.example.MapleChat.dto.character.CharacterStat;
import com.example.MapleChat.service.NexonApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/character")
public class CharacterController {

    private final NexonApiService nexonApiService;

    public CharacterController(NexonApiService nexonApiService) {
        this.nexonApiService = nexonApiService;
    }

    @GetMapping("/basic")
    public CharacterBasicInfo getBasic(@RequestParam String name) {
        return nexonApiService.getBasicByName(name);
    }

    @GetMapping("/popularity")
    public CharacterPopularity getPopularity(@RequestParam String name) {
        return nexonApiService.getPopularityByName(name);
    }

    @GetMapping("/image")
    public String getCharacterImage(
            @RequestParam String name,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) Integer actionFrame,
            @RequestParam(required = false) String emotion,
            @RequestParam(required = false) Integer emotionFrame,
            @RequestParam(required = false) String wmotion
    ) {
        CharacterBasicInfo info = nexonApiService.getBasicByName(name);
        return nexonApiService.buildCharacterImg(
                info.getCharacterImage(),
                action,
                actionFrame,
                emotion,
                emotionFrame,
                wmotion
        );
    }

    @GetMapping("/ability")
    public CharacterAbility getAbility(@RequestParam String name) {
        return nexonApiService.getAbilityByName(name);
    }
    
    @GetMapping("/propensity")
    public CharacterPropensity getPropensity(@RequestParam String name) {
        return nexonApiService.getPropensityByName(name);
    }

    @GetMapping("/stat")
    public CharacterStat getStat(@RequestParam String name) {
        return nexonApiService.getStatByName(name);
    }

    @GetMapping("/hyper-stat")
    public CharacterHyperStat getHyperStat(@RequestParam String name) {
        return nexonApiService.getHyperStatByName(name);
    }

    @GetMapping("/equipment")
    public CharacterItemEquipment getEquipment(@RequestParam String name) {
        return nexonApiService.getEquipmentByName(name);
    }

    @GetMapping("/cash-equipment")
    public CharacterCashItemEquipment getCashEquipment(@RequestParam String name) {
        return nexonApiService.getCashEquipmentByName(name);
    }
}
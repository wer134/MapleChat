package com.example.MapleChat.controller;

import com.example.MapleChat.dto.CharacterAbility;
import com.example.MapleChat.dto.CharacterBasicInfo;
import com.example.MapleChat.dto.CharacterHyperStat;
import com.example.MapleChat.dto.CharacterOcid;
import com.example.MapleChat.dto.CharacterPopularity;
import com.example.MapleChat.dto.CharacterPropensity;
import com.example.MapleChat.dto.CharacterStat;
import com.example.MapleChat.dto.CharacterItemEquipment;
import com.example.MapleChat.service.NexonApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CharacterController {

    private final NexonApiService nexonApiService;

    public CharacterController(NexonApiService nexonApiService) {
        this.nexonApiService = nexonApiService;
    }

    public CharacterOcid getid(@RequestParam String name) {
        return nexonApiService.getId(name);
    }
    
    @GetMapping("/character/basic")
    public CharacterBasicInfo getBasic(@RequestParam String name) {
        return nexonApiService.getBasicByName(name);
    }

    @GetMapping("/character/popularity")
    public CharacterPopularity getPopularity(@RequestParam String name) {
        return nexonApiService.getPopularityByName(name);
    }

    @GetMapping("/character/image")
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

    @GetMapping("/character/ability")
    public CharacterAbility getAbility(@RequestParam String name) {
        return nexonApiService.getAbilityByName(name);
    }
    
    @GetMapping("/character/propensity")
    public CharacterPropensity getPropensity(@RequestParam String name) {
        return nexonApiService.getPropensityByName(name);
    }

    @GetMapping("/character/stat")
    public CharacterStat getStat(@RequestParam String name) {
        return nexonApiService.getStatByName(name);
    }

    @GetMapping("/character/hyper-stat")
    public CharacterHyperStat getHyperStat(@RequestParam String name) {
        return nexonApiService.getHyperStatByName(name);
    }

    @GetMapping("/character/equipment")
    public CharacterItemEquipment getEquipment(@RequestParam String name) {
        return nexonApiService.getEquipmentByName(name);
    }
}
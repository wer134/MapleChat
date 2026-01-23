package com.example.MapleChat.controller;

import com.example.MapleChat.dto.CharacterBasicInfo;
import com.example.MapleChat.dto.CharacterOcid;
import com.example.MapleChat.dto.CharacterPopularity;
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
    
}

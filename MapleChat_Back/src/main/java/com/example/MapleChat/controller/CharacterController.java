package com.example.MapleChat.controller;

import com.example.MapleChat.dto.CharacterBasicResponse;
import com.example.MapleChat.dto.CharacterOcid;
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

    @GetMapping("/character/id")
    public CharacterOcid getid(@RequestParam String name) {
        return nexonApiService.getid(name);
    }
    
    @GetMapping("/character/basic")
    public CharacterBasicResponse getBasic(@RequestParam String ocid) {
        return nexonApiService.getBasic(ocid);
    }
}

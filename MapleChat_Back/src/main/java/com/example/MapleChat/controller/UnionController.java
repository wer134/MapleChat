package com.example.MapleChat.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MapleChat.dto.union.Union;
import com.example.MapleChat.dto.union.UnionArtiFact;
import com.example.MapleChat.dto.union.UnionChampion;
import com.example.MapleChat.dto.union.UnionRaider;
import com.example.MapleChat.service.NexonApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/union")
public class UnionController {
    private final NexonApiService nexonApiService; 

    public UnionController(NexonApiService nexonApiService) {
        this.nexonApiService = nexonApiService;
    }

    @GetMapping("/union")
    public Union getUnion(@RequestParam String name) {
        return nexonApiService.getUnionByName(name);
    }
    
    @GetMapping("/union-raider")
    public UnionRaider getUnionRaider(@RequestParam String name) {
        return nexonApiService.getUnionRaiderByName(name);
    }

    @GetMapping("/union-artifact")
    public UnionArtiFact getUnionArtiFact(@RequestParam String name) {
        return nexonApiService.getArtiFactByName(name);
    }

    @GetMapping("/union-champion")
    public UnionChampion getChampion(@RequestParam String name) {
        return nexonApiService.getChampionByName(name);
    }
}

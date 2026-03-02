package com.example.MapleChat.controller;

import java.util.Collections;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.MapleChat.dto.union.Union;
import com.example.MapleChat.dto.union.UnionArtiFact;
import com.example.MapleChat.dto.union.UnionChampion;
import com.example.MapleChat.dto.union.UnionRaider;
import com.example.MapleChat.service.NexonApiService;

@RestController
@RequestMapping("/union")
public class UnionController {
    private static final Object EMPTY_JSON = Collections.emptyMap();

    private final NexonApiService nexonApiService;

    public UnionController(NexonApiService nexonApiService) {
        this.nexonApiService = nexonApiService;
    }

    @GetMapping("/union")
    public ResponseEntity<Object> getUnion(@RequestParam String name) {
        Union result = nexonApiService.getUnionByName(name);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.ok(EMPTY_JSON);
    }

    @GetMapping("/union-raider")
    public ResponseEntity<Object> getUnionRaider(@RequestParam String name) {
        UnionRaider result = nexonApiService.getUnionRaiderByName(name);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.ok(EMPTY_JSON);
    }

    @GetMapping("/union-artifact")
    public ResponseEntity<Object> getUnionArtiFact(@RequestParam String name) {
        UnionArtiFact result = nexonApiService.getArtiFactByName(name);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.ok(EMPTY_JSON);
    }

    @GetMapping("/union-champion")
    public ResponseEntity<Object> getChampion(@RequestParam String name) {
        UnionChampion result = nexonApiService.getChampionByName(name);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.ok(EMPTY_JSON);
    }
}

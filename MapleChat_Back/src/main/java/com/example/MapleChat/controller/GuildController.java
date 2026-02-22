package com.example.MapleChat.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.MapleChat.dto.guild.GuildBasic;
import com.example.MapleChat.service.NexonApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/guild")
public class GuildController {
    private final NexonApiService nexonApiService;

    public GuildController(NexonApiService nexonApiService) {
        this.nexonApiService = nexonApiService;
    }

    @GetMapping("/basic")
    public GuildBasic getBasic(@RequestParam String guildName, @RequestParam String worldName) {
        return nexonApiService.getGuildBasicByName(guildName, worldName);
    }
}

package com.example.MapleChat.dto.guild;

import java.util.List;

import com.example.MapleChat.dto.guild.skill.NoblesseSkill;
import com.example.MapleChat.dto.guild.skill.Skill;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class GuildBasic {
    @JsonProperty("world_name") 
    private String worldName;

    @JsonProperty("guild_name")
    private String guildName;

    @JsonProperty("guild_level")
    private Long guildLevel;

    @JsonProperty("guild_fame")
    private Long guildFame;

    @JsonProperty("guild_point")
    private Long guildPoint;

    @JsonProperty("guild_master_name")
    private String guildMasterName;

    @JsonProperty("guild_member_count")
    private Long guildMemberCount;

    @JsonProperty("guild_member")
    private List<String> guildMember;

    @JsonProperty("guild_skill")
    private List<Skill> guildSkill;

    @JsonProperty("guild_noblesse_skill")
    private List<NoblesseSkill> guildNoblesseSkill;
}

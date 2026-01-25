package com.example.MapleChat.dto.character;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

// 캐릭터 종합 스탯 정보
@Data
public class CharacterStat {
    @JsonProperty("final_stat")
    private List<FinalStat> finalStat;

    @Data
    public static class FinalStat {
        @JsonProperty("stat_name")
        private String statName;

        @JsonProperty("stat_value")
        private String statValue;
    }
}


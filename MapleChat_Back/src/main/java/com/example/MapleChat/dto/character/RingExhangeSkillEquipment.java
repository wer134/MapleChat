package com.example.MapleChat.dto.character;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class RingExhangeSkillEquipment {
    @JsonProperty("special_ring_exchange_name")
    private String specialRingExchangeName;

    @JsonProperty("special_ring_exchange_level")
    private Long specialRingExchangeLevel;

    @JsonProperty("special_ring_exchange_icon")
    private String specialRingExchangeIcon;

    @JsonProperty("special_ring_exchange_description")
    private String specialRingExchangeDescription;
}

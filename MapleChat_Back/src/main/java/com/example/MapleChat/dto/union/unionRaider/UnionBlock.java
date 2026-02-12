package com.example.MapleChat.dto.union.unionRaider;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class UnionBlock {
    @JsonProperty("block_type") 
    private String blockType;

    @JsonProperty("block_class")
    private String blockClass;

    @JsonProperty("block_level")
    private String blockLevel;

    @JsonProperty("block_control_point")
    private BlockControlPoint blockControlPoint;

    @JsonProperty("block_position")
    private List<BlockPosition> blockPosition;
}

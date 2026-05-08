package com.example.MapleChat.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    public enum MessageType { ENTER, TALK, LEAVE }

    private MessageType type;
    private String sender;
    private String content;
    private String characterImage;
}

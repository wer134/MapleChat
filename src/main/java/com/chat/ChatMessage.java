package main.java.com.chat;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ChatMessage {
    public enum MessageType {
        SYSTEM, CHAT, USER_JOINED, USER_LEFT, USERNAME_CHANGED
    }
    private MessageType type;
    private String username;
    private String message;
    private Integer clientId;
    private String timestamp;
    private java.util.List<UserInfo> onlineUsers;


    public ChatMessage(){
        this.timestamp = LocalDateTime.now()
        .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
    public ChatMessage(MessageType type, String message) {
        this();
        this.type = type;
        this.message = message;
    }
    public ChatMessage(MessageType type, String message, Integer clientId) {
        this();
        this.type = type;
        this.message = message;
        this.clientId = clientId;
    }
    public MessageType getType() {
        return type;
    }
    public void setType(MessageType type) {
        this.type = type;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public Integer getClientId() {
        return clientId;
    }
    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }
    public String getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
    public java.util.List<UserInfo> getOnlineUsers() {
        return onlineUsers;
    }
    public void setOnlineUsers(java.util.List<UserInfo> onlineUsers) {
        this.onlineUsers = onlineUsers;
    }
    public static class UserInfo {
        private Integer id;
        private String username;
        public UserInfo(Integer id, String username) {
            this.id = id;
            this.username = username;
        }
        public Integer getId() {
            return id;
        }
        public void setId(Integer id) {
            this.id = id;
        }
        public String getUsername() {
            return username;
        }
        public void setUsername(String username) {
            this.username = username;
        }
    }
}

package main.java.com.chat;

import com.google.gson.Gson;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@ServerEndpoint("/chat")
public class ChatEndpoint {
    private static final Map<Integer, ChatSession> sessions = new ConcurrentHashMap<>();
    private static final AtomicInteger clientIdCounter = new AtomicInteger(0);
    private static final Gson gson = new Gson();

    private Integer clientId;
    private String username;
    private Session session;

    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        this.clientId = clientIdCounter.incrementAndGet();
        this.username = "사용자" + clientId;

        ChatSession chatSession = new ChatSession(session, clientId, username);
        sessions.put(clientId, chatSession);

        System.out.println("클라이언트 " + clientId + " 연결됨: " + session.getId());

        // 환영 메시지 전송
        sendToClient(new ChatMessage(ChatMessage.MessageType.SYSTEM,
            "채팅방에 입장하셨습니다.", clientId));

        // 다른 클라이언트들에게 입장 알림
        broadcastUserJoined(clientId);
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        try {
            Map<String, Object> data = gson.fromJson(message, Map.class);
            String type = (String) data.get("type");

            if ("chat".equals(type)) {
                String chatMessage = (String) data.get("message");
                if (chatMessage != null && !chatMessage.trim().isEmpty()) {
                    broadcastChatMessage(chatMessage);
                }
            } else if ("set-username".equals(type)) {
                String newUsername = (String) data.get("username");
                if (newUsername != null && !newUsername.trim().isEmpty()) {
                    setUsername(newUsername);
                }
            }
        } catch (Exception e) {
            System.err.println("메시지 처리 오류: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("클라이언트 " + clientId + " 연결 종료: " + session.getId());
        
        sessions.remove(clientId);
        
        // 다른 클라이언트들에게 퇴장 알림
        broadcastUserLeft();
    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.err.println("클라이언트 " + clientId + " 오류: " + error.getMessage());
        error.printStackTrace();
    }

    private void sendToClient(ChatMessage message) {
        try {
            String json = gson.toJson(message);
            session.getBasicRemote().sendText(json);
        } catch (IOException e) {
            System.err.println("메시지 전송 오류: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void broadcastChatMessage(String message) {
        ChatMessage chatMessage = new ChatMessage(ChatMessage.MessageType.CHAT, message);
        chatMessage.setUsername(username);
        chatMessage.setClientId(clientId);

        broadcast(chatMessage, clientId);
    }

    private void broadcastUserJoined(Integer newClientId) {
        ChatMessage message = new ChatMessage(ChatMessage.MessageType.USER_JOINED,
            "사용자" + newClientId + "님이 입장하셨습니다.");
        message.setClientId(newClientId);
        message.setOnlineUsers(getOnlineUsersList());

        broadcast(message, newClientId);
    }

    private void broadcastUserLeft() {
        ChatMessage message = new ChatMessage(ChatMessage.MessageType.USER_LEFT,
            username + "님이 퇴장하셨습니다.");
        message.setClientId(clientId);
        message.setOnlineUsers(getOnlineUsersList());

        broadcast(message, null);
    }

    private void setUsername(String newUsername) {
        String oldUsername = this.username;
        this.username = newUsername;
        
        ChatSession chatSession = sessions.get(clientId);
        if (chatSession != null) {
            chatSession.setUsername(newUsername);
        }

        ChatMessage message = new ChatMessage(ChatMessage.MessageType.USERNAME_CHANGED,
            oldUsername + "님이 " + newUsername + "으로 이름을 변경했습니다.");
        message.setClientId(clientId);
        message.setUsername(newUsername);

        broadcast(message, null);
    }

    private void broadcast(ChatMessage message, Integer excludeClientId) {
        String json = gson.toJson(message);
        
        sessions.entrySet().stream()
            .filter(entry -> !entry.getKey().equals(excludeClientId))
            .forEach(entry -> {
                try {
                    Session s = entry.getValue().getSession();
                    if (s.isOpen()) {
                        s.getBasicRemote().sendText(json);
                    }
                } catch (IOException e) {
                    System.err.println("브로드캐스트 오류: " + e.getMessage());
                }
            });
    }

    private java.util.List<ChatMessage.UserInfo> getOnlineUsersList() {
        return sessions.values().stream()
            .map(s -> new ChatMessage.UserInfo(s.getClientId(), s.getUsername()))
            .collect(Collectors.toList());
    }

    // 내부 클래스: 세션 정보 관리
    private static class ChatSession {
        private Session session;
        private Integer clientId;
        private String username;

        public ChatSession(Session session, Integer clientId, String username) {
            this.session = session;
            this.clientId = clientId;
            this.username = username;
        }

        public Session getSession() {
            return session;
        }

        public Integer getClientId() {
            return clientId;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }
}
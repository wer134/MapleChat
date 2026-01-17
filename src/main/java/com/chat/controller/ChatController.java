package com.chat.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 채팅 관련 REST API Controller
 */
@RestController
@RequestMapping("/api/chat")
public class ChatController {
    
    // 임시 메시지 저장소 (실제로는 데이터베이스 사용)
    private static final List<Map<String, Object>> messageHistory = new ArrayList<>();
    
    /**
     * 메시지 히스토리 조회
     * GET /api/chat/history?guild_name=xxx&limit=50&cursor=xxx
     * 
     * @param guildName 길드 이름 (선택사항)
     * @param limit 조회할 메시지 개수 (기본값: 50)
     * @param cursor 페이지네이션 커서 (선택사항)
     * @return 메시지 히스토리 목록
     */
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getHistory(
            @RequestParam(required = false) String guild_name,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(required = false) String cursor) {
        
        Map<String, Object> response = new HashMap<>();
        
        // 실제로는 데이터베이스에서 조회해야 함
        List<Map<String, Object>> messages = new ArrayList<>();
        
        // 임시 데이터 반환 (실제로는 DB 조회)
        synchronized (messageHistory) {
            int startIndex = 0;
            if (cursor != null) {
                // 커서 기반 페이지네이션 로직
                try {
                    startIndex = Integer.parseInt(cursor);
                } catch (NumberFormatException e) {
                    startIndex = 0;
                }
            }
            
            int endIndex = Math.min(startIndex + limit, messageHistory.size());
            if (startIndex < messageHistory.size()) {
                messages = new ArrayList<>(messageHistory.subList(
                    Math.max(0, messageHistory.size() - endIndex),
                    messageHistory.size() - startIndex
                ));
                Collections.reverse(messages);
            }
        }
        
        response.put("success", true);
        response.put("messages", messages);
        response.put("cursor", messages.isEmpty() ? null : String.valueOf(limit));
        response.put("has_more", messages.size() >= limit);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 메시지 저장
     * POST /api/chat/message
     * 
     * @param messageData 메시지 데이터
     * @return 저장 결과
     */
    @PostMapping("/message")
    public ResponseEntity<Map<String, Object>> saveMessage(@RequestBody Map<String, Object> messageData) {
        try {
            // 메시지 데이터 검증
            if (!messageData.containsKey("message") || !messageData.containsKey("username")) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "메시지와 사용자 이름은 필수입니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            // 메시지 저장 (실제로는 데이터베이스에 저장해야 함)
            Map<String, Object> savedMessage = new HashMap<>();
            savedMessage.put("id", System.currentTimeMillis());
            savedMessage.put("message", messageData.get("message"));
            savedMessage.put("username", messageData.get("username"));
            savedMessage.put("client_id", messageData.get("client_id"));
            savedMessage.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            savedMessage.put("type", messageData.getOrDefault("type", "CHAT"));
            
            synchronized (messageHistory) {
                messageHistory.add(savedMessage);
                // 메시지 히스토리 크기 제한 (최대 1000개)
                if (messageHistory.size() > 1000) {
                    messageHistory.remove(0);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "메시지가 저장되었습니다.");
            response.put("data", savedMessage);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "메시지 저장 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * 메시지 삭제 (선택사항)
     * DELETE /api/chat/message/{id}
     */
    @DeleteMapping("/message/{id}")
    public ResponseEntity<Map<String, Object>> deleteMessage(@PathVariable String id) {
        synchronized (messageHistory) {
            boolean removed = messageHistory.removeIf(msg -> 
                String.valueOf(msg.get("id")).equals(id)
            );
            
            Map<String, Object> response = new HashMap<>();
            if (removed) {
                response.put("success", true);
                response.put("message", "메시지가 삭제되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "메시지를 찾을 수 없습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        }
    }
}

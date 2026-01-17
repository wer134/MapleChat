package com.chat.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.*;

/**
 * 인증 관련 REST API Controller
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    /**
     * 로그인 API
     * POST /api/auth/login
     * 
     * @param loginData 로그인 요청 데이터 (character_name 포함)
     * @return 인증 토큰 및 사용자 정보
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
        String characterName = loginData.get("character_name");
        
        if (characterName == null || characterName.trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "캐릭터 이름을 입력해주세요.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        // 임시 토큰 생성 (실제로는 JWT 등을 사용해야 함)
        String token = generateToken(characterName);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", token);
        response.put("character_name", characterName);
        response.put("message", "로그인 성공");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 토큰 검증 API (선택사항)
     * GET /api/auth/verify
     */
    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyToken(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.put("valid", false);
            response.put("message", "토큰이 없습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        String token = authHeader.substring(7);
        // 실제로는 토큰 검증 로직 필요
        // 현재는 토큰이 존재하면 유효한 것으로 간주
        boolean isValid = token != null && !token.isEmpty();
        
        response.put("valid", isValid);
        response.put("message", isValid ? "토큰이 유효합니다." : "토큰이 유효하지 않습니다.");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 임시 토큰 생성 메서드
     * 실제로는 JWT 등을 사용해야 함
     */
    private String generateToken(String characterName) {
        // 임시 토큰 생성 (실제로는 JWT 라이브러리 사용)
        return "token_" + characterName + "_" + System.currentTimeMillis();
    }
}

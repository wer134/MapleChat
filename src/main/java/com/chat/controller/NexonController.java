package com.chat.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.*;

/**
 * Nexon API 중계 Controller
 * 외부 Nexon API를 호출하여 캐릭터 정보 등을 조회
 */
@RestController
@RequestMapping("/api/nexon")
public class NexonController {
    
    @Value("${nexon.api.key:}")
    private String nexonApiKey;
    
    @Value("${nexon.api.base-url:https://open.api.nexon.com}")
    private String nexonBaseUrl;
    
    /**
     * 캐릭터 기본 정보 조회
     * GET /api/nexon/character/{characterName}
     * 
     * @param characterName 캐릭터 이름
     * @return 캐릭터 정보
     */
    @GetMapping("/character/{characterName}")
    public ResponseEntity<Map<String, Object>> getCharacterInfo(
            @PathVariable String characterName) {
        
        if (characterName == null || characterName.trim().isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "캐릭터 이름을 입력해주세요.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        try {
            // Nexon API 호출 예시
            // 실제 Nexon API는 ocid를 먼저 조회해야 할 수 있음
            
            // 1단계: 캐릭터 ocid 조회
            String ocid = getCharacterOcid(characterName);
            
            if (ocid == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "캐릭터를 찾을 수 없습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            // 2단계: ocid로 캐릭터 기본 정보 조회
            Map<String, Object> characterInfo = getCharacterBasicInfo(ocid);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("character_name", characterName);
            response.put("ocid", ocid);
            response.put("data", characterInfo);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "캐릭터 정보 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * 캐릭터 ocid 조회
     * Nexon API: GET /maplestory/v1/id
     * 
     * 실제 구현 시 WebClient 또는 RestTemplate 사용
     * 현재는 임시 데이터 반환
     */
    private String getCharacterOcid(String characterName) {
        try {
            if (nexonApiKey == null || nexonApiKey.isEmpty()) {
                // API 키가 없으면 임시 데이터 반환
                return "temp_ocid_" + characterName;
            }
            
            // TODO: 실제 Nexon API 호출 구현
            // WebClient 또는 RestTemplate을 사용하여 API 호출
            // 예시:
            // WebClient webClient = WebClient.builder()
            //     .baseUrl(nexonBaseUrl)
            //     .defaultHeader("x-nxopen-api-key", nexonApiKey)
            //     .build();
            // 
            // Map<String, Object> response = webClient.get()
            //     .uri("/maplestory/v1/id?character_name={name}", characterName)
            //     .retrieve()
            //     .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
            //     .block();
            // 
            // if (response != null && response.containsKey("ocid")) {
            //     return (String) response.get("ocid");
            // }
            
            return "temp_ocid_" + characterName;
            
        } catch (Exception e) {
            System.err.println("OCID 조회 오류: " + e.getMessage());
            // API 키가 없거나 오류 발생 시 임시 데이터 반환
            return "temp_ocid_" + characterName;
        }
    }
    
    /**
     * 캐릭터 기본 정보 조회
     * Nexon API: GET /maplestory/v1/character/basic
     * 
     * 실제 구현 시 WebClient 또는 RestTemplate 사용
     * 현재는 임시 데이터 반환
     */
    private Map<String, Object> getCharacterBasicInfo(String ocid) {
        try {
            if (nexonApiKey == null || nexonApiKey.isEmpty()) {
                // API 키가 없으면 임시 데이터 반환
                Map<String, Object> tempData = new HashMap<>();
                tempData.put("character_name", "임시캐릭터");
                tempData.put("level", 200);
                tempData.put("world_name", "스카니아");
                tempData.put("character_class", "아델");
                return tempData;
            }
            
            // TODO: 실제 Nexon API 호출 구현
            // WebClient 또는 RestTemplate을 사용하여 API 호출
            // 예시:
            // WebClient webClient = WebClient.builder()
            //     .baseUrl(nexonBaseUrl)
            //     .defaultHeader("x-nxopen-api-key", nexonApiKey)
            //     .build();
            // 
            // Map<String, Object> response = webClient.get()
            //     .uri("/maplestory/v1/character/basic?ocid={ocid}", ocid)
            //     .retrieve()
            //     .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
            //     .block();
            // 
            // return response != null ? response : new HashMap<>();
            
            // 임시 데이터 반환
            Map<String, Object> tempData = new HashMap<>();
            tempData.put("character_name", "임시캐릭터");
            tempData.put("level", 200);
            tempData.put("world_name", "스카니아");
            tempData.put("character_class", "아델");
            tempData.put("ocid", ocid);
            return tempData;
            
        } catch (Exception e) {
            System.err.println("캐릭터 정보 조회 오류: " + e.getMessage());
            // 오류 발생 시 임시 데이터 반환
            Map<String, Object> tempData = new HashMap<>();
            tempData.put("character_name", "정보없음");
            tempData.put("error", "API 호출 실패");
            return tempData;
        }
    }
}

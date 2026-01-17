# 프론트엔드 - Java 서버 연동 준비

## 파일 구조

```
src/main/webapp/
├── index.html      # 메인 HTML 파일
├── chat.js         # WebSocket 클라이언트 (수정됨)
├── config.js       # Java 서버 설정 (새로 생성)
├── api.js          # REST API 클라이언트 (새로 생성)
└── README.md       # 이 파일
```

## Java 서버 연동 준비 완료

### 1. config.js
- Java 서버 URL 설정
- WebSocket 엔드포인트 설정
- REST API 엔드포인트 설정
- 재연결 설정
- 메시지 설정

### 2. api.js
- REST API 클라이언트 클래스
- 로그인 함수 (향후 구현)
- 히스토리 조회 함수 (향후 구현)
- Nexon API 중계 함수 (향후 구현)
- 토큰 관리

### 3. chat.js (수정됨)
- CONFIG 사용하도록 수정
- Java 서버 WebSocket URL 생성 함수 사용
- 재연결 설정을 CONFIG에서 가져오도록 수정
- API 인스턴스 준비

## 사용 방법

### 현재 상태
- WebSocket 연결: `/chat` 엔드포인트 사용
- 인증: 아직 구현되지 않음
- 메시지 형식: Java 서버와 호환

### 향후 사용 (인증 추가 시)
```javascript
// chat.js의 connect() 함수에서
const token = this.api.token; // 토큰 사용
const wsUrl = CONFIG.getWebSocketUrl(token);
```

### REST API 사용 (향후)
```javascript
// 로그인
await api.login('캐릭터명');

// 히스토리 조회
const history = await api.getHistory('길드명');

// 캐릭터 정보 조회
const character = await api.getCharacterInfo('캐릭터명');
```

## Java 서버 엔드포인트 (예상)

### WebSocket
- `ws://localhost:8080/chat` (현재)
- `ws://localhost:8080/chat?token=...` (향후 인증)

### REST API (향후 구현 예정)
- `POST /api/auth/login` - 로그인
- `GET /api/chat/history` - 히스토리 조회
- `GET /api/nexon/character/{name}` - 캐릭터 정보
- `POST /api/chat/message` - 메시지 저장 (선택)

## 다음 단계

1. ✅ Java 서버 연동 준비 완료
2. ⏳ Java 서버 REST API 구현 대기
3. ⏳ 인증 기능 추가 대기
4. ⏳ 실제 연동 테스트

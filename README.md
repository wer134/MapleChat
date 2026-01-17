# MapleChat - 메이플스토리 길드 채팅

WebSocket 기반 실시간 채팅 애플리케이션

## 프로젝트 구조

```
websocketchat/
├── src/main/java/com/chat/     # Java 백엔드
│   ├── ChatServer.java          # 서버 시작
│   ├── ChatEndpoint.java       # WebSocket 엔드포인트
│   └── ChatMessage.java        # 메시지 모델
├── src/main/webapp/            # 프론트엔드
│   ├── index.html              # 메인 HTML
│   ├── chat.js                 # WebSocket 클라이언트
│   ├── config.js               # 서버 설정
│   └── api.js                  # REST API 클라이언트
└── pom.xml                     # Maven 설정
```

## 기술 스택

- **백엔드**: Java 17, Jakarta WebSocket (Tyrus), Grizzly HTTP Server
- **프론트엔드**: HTML, CSS, JavaScript
- **빌드 도구**: Maven

## 브랜치 구조

```
main
 ├─ choi
 └─ kim
```

## 브랜치 생성

### choi 브랜치
```bash
git checkout main
git pull
git checkout -b choi
git push -u origin choi
```

### kim 브랜치
```bash
git checkout main
git pull
git checkout -b kim
git push -u origin kim
```

## 작업 규칙

### 기본 규칙
- **choi**: choi 브랜치에서만 작업
- **kim**: kim 브랜치에서만 작업
- **main**: PR로만 병합 (직접 커밋 금지)

### 병합 흐름
1. 각자 브랜치에서 작업
2. 필요하면 main 최신화:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
3. PR 생성: `choi → main`, `kim → main`

### 기능 브랜치 (선택사항)
필요하면 개인 브랜치에서 기능 브랜치 생성:

```bash
# choi의 기능 브랜치
git checkout choi

# kim의 기능 브랜치
git checkout kim
```

## 실행 방법

### 서버 실행
```bash
mvn clean compile
mvn exec:java -Dexec.mainClass="com.chat.ChatServer"
```

### 접속
- 웹 클라이언트: http://localhost:8080/index.html
- WebSocket: ws://localhost:8080/chat

## 개발 상태

### 완료
- ✅ 기본 WebSocket 채팅 (인증 없이)
- ✅ 프론트엔드 UI
- ✅ Java 서버 연동 준비

### 진행 예정
- ⏳ Spring Boot 서버 구축
- ⏳ REST API 구현
- ⏳ 인증 시스템 (JWT)
- ⏳ Nexon API 연동
- ⏳ 데이터베이스 연동
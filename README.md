# MapleChat

> 넥슨 Open API 기반 메이플스토리 캐릭터 정보 조회 + 실시간 채팅 웹앱

**라이브 데모**: https://maple-chat.vercel.app

---

## 주요 기능

| 기능 | 설명 |
|---|---|
| 캐릭터 검색 | 닉네임으로 레벨·직업·월드·이미지 조회, 검색 히스토리 |
| 장비 뷰어 | 인게임과 동일한 슬롯 배치, 호버 툴팁(스타포스·잠재옵션·등급별 색상), 클릭 고정 |
| 스탯 / 어빌리티 | 전투력·주요 스탯 요약, 하이퍼스탯, 어빌리티, 성향 |
| 유니온 배치도 | 20×20 인터랙티브 그리드, 직업군별 색상, 캐릭터 하이라이트, 필터·검색 |
| 길드 정보 | 길드명+월드명 검색, 캐릭터 소속 길드 원클릭 바로가기 |
| 실시간 채팅 | WebSocket(STOMP) 기반 채팅, 캐릭터 이미지 프로필 |
| 캐릭터 비교 | 두 캐릭터 정보 나란히 비교 |
| 데스크탑 앱 | Electron으로 Windows `.exe` 빌드 가능 |

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| Frontend | React 19, CSS Variables (다크 모드), Electron 33 |
| Backend | Spring Boot 3, Java 17, WebClient (비동기) |
| 실시간 | STOMP over SockJS (Spring WebSocket) |
| API | 넥슨 MapleStory Open API |
| 배포 | Vercel (프론트) · Railway (백엔드) |
| API 문서 | SpringDoc OpenAPI (Swagger UI) |

---

## 아키텍처

```
브라우저 / Electron
  └── React Frontend (Vercel)
        │  HTTP REST  →  Spring Boot Backend (Railway)
        │  WebSocket  →       │
        │                     └── 넥슨 MapleStory Open API
        │                     └── STOMP 채팅 브로커 (인메모리)
```

---

## 로컬 실행

### 사전 조건
- Java 17+
- Node.js 18+
- 넥슨 Open API 키 ([발급](https://openapi.nexon.com/))

### 백엔드
```bash
cd MapleChat_Back
# 환경변수 설정
export NEXON_API_KEY=YOUR_KEY
export CORS_ALLOWED_ORIGINS=http://localhost:3000
./mvnw spring-boot:run
# http://localhost:8080/swagger-ui.html
```

### 프론트엔드 (웹)
```bash
cd MapleChat_Front/frontend
# .env 파일 생성 (없으면 proxy로 localhost:8080 사용)
echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env
npm install
npm start
# http://localhost:3000
```

### Electron 데스크탑 앱
```bash
cd MapleChat_Front/frontend
npm run electron:start

# Windows 인스톨러 빌드
npm run electron:build   # dist/ 폴더에 .exe 생성
```

---

## 배포 환경변수

### Railway (백엔드)

| 변수 | 설명 |
|---|---|
| `NEXON_API_KEY` | 넥슨 Open API 키 (필수) |
| `CORS_ALLOWED_ORIGINS` | 프론트 도메인, 쉼표로 다중 허용<br>예: `https://maple-chat.vercel.app,http://localhost:3000` |
| `PORT` | Railway 자동 주입 (설정 불필요) |

### Vercel (프론트엔드)

| 변수 | 설명 |
|---|---|
| `REACT_APP_API_URL` | Railway 백엔드 URL<br>예: `https://maplechat-production.up.railway.app` |

> 환경변수 변경 후 **양쪽 모두 Redeploy** 필요

---

## API 엔드포인트

Swagger UI: `http://localhost:8080/swagger-ui.html`

| Method | Path | 설명 |
|---|---|---|
| GET | `/character/basic` | 기본 정보 |
| GET | `/character/equipment` | 장비 |
| GET | `/character/stat` | 스탯 |
| GET | `/character/hyper-stat` | 하이퍼스탯 |
| GET | `/character/ability` | 어빌리티 |
| GET | `/character/propensity` | 성향 |
| GET | `/character/android-equipment` | 안드로이드 |
| GET | `/character/symbol-equipment` | 심볼 |
| GET | `/character/skill` | 스킬 |
| GET | `/character/link-skill` | 링크스킬 |
| GET | `/character/vmatrix` | V매트릭스 |
| GET | `/character/hexamatrix` | HEXA 매트릭스 |
| GET | `/character/dojang` | 무릉도장 |
| GET | `/guild/basic` | 길드 정보 |
| GET | `/union` | 유니온 |
| GET | `/union/raider` | 유니온 블록 배치 |

---

## 구현 포인트

### OCID 인메모리 캐시
넥슨 API는 이름 → OCID 변환 후 OCID로 조회하는 2-step 구조입니다. 같은 캐릭터 반복 조회 시 추가 API 호출을 줄이기 위해 `ConcurrentHashMap` 캐시를 적용했습니다.

```java
private final Map<String, String> ocidCache = new ConcurrentHashMap<>();

private String getOcid(String name) {
    return ocidCache.computeIfAbsent(name, n -> {
        CharacterOcid id = fetch("/maplestory/v1/id", CharacterOcid.class, "character_name", n);
        return id.getCharacterOcid();
    });
}
```

### 장비 슬롯 정규화
API가 반환하는 슬롯명이 "반지1" / "반지 (1)" / "반지(1)" 등 일관성이 없어 숫자·공백·괄호를 제거해 그리드 매핑을 통일했습니다.

```js
const normalizeSlot = (s) =>
  (s || "").replace(/[0-9]/g, "").replace(/\s+/g, "").replace(/[()_-]/g, "").trim();
```

### 병렬 API 호출 + 독립 에러 처리
캐릭터 조회 시 장비·스탯·어빌리티·성향·하이퍼스탯을 `Promise.all`로 동시 요청합니다. 각 항목이 개별 에러 상태를 가지므로 일부 실패가 전체 화면 오류로 번지지 않으며 항목별 재시도 버튼을 제공합니다.

---

## 디렉터리 구조

```
MapleChat_Back/src/main/java/com/example/MapleChat/
├── config/        # CORS, WebSocket, Swagger 설정
├── controller/    # CharacterController, GuildController, UnionController, ChatController
├── service/       # NexonApiService (WebClient + OCID 캐시)
├── dto/           # 넥슨 API 응답 DTO
└── exception/     # GlobalExceptionHandler, NexonApiException

MapleChat_Front/frontend/src/
├── api/           # characterApi, guildApi (fetch 래퍼)
├── components/    # SearchBox, EquipmentTooltip, UnionMapViewer, ChatPanel 등
├── hooks/         # useCharacterData, useCharacterCompare, useSearchHistory, useChat
├── utils/         # formatters, gameLogic, unionShapes, worldIcons
├── constants/     # equipmentSlots (장비 그리드 레이아웃)
└── types/         # unionTypes (직업군·랭크 상수)
```

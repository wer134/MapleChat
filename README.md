# MapleChat

메이플스토리 캐릭터 정보 조회 데스크탑 앱

> 넥슨 Open API를 활용해 캐릭터의 장비, 스탯, 유니온 배치도, 길드 정보를 한 화면에서 조회할 수 있는 Electron + React 애플리케이션

---

## 스크린샷

> **[스크린샷 필요] 메인 대시보드 전체 화면**
> - 캐릭터 검색 후 장비 그리드, 캐릭터 이미지, 주요 스탯이 표시된 상태

> **[스크린샷 필요] 장비 툴팁**
> - 장비 아이템에 마우스를 올렸을 때 잠재옵션·스타포스·기본 옵션이 표시된 툴팁 (레전드리/유니크 등 등급별 테두리 색상 포함)

> **[스크린샷 필요] 유니온 배치도**
> - 20×20 그리드에 직업별 색상으로 블록이 배치된 유니온 맵, 좌측 캐릭터 목록과 필터 패널

> **[스크린샷 필요] 다크/라이트 모드 비교**
> - 같은 화면의 라이트 모드 / 다크 모드 나란히

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| Frontend | React 19, CSS Variables (테마), Electron 33 |
| Backend | Spring Boot 4, Java 17, Spring WebFlux (WebClient) |
| API | 넥슨 MapleStory Open API |
| 빌드 | electron-builder (Windows NSIS 인스톨러) |
| API 문서 | SpringDoc OpenAPI (Swagger UI) |

---

## 시스템 아키텍처

```
┌──────────────────────────────────────┐
│           Electron App               │
│  ┌────────────────────────────────┐  │
│  │       React Frontend           │  │
│  │  - 장비 그리드 / 유니온 맵      │  │
│  │  - 커스텀 훅 (데이터 분리)      │  │
│  └──────────┬─────────────────────┘  │
│             │ HTTP (proxy :8080)     │
└─────────────┼────────────────────────┘
              │
┌─────────────▼────────────────────────┐
│       Spring Boot Backend            │
│  - OCID 인메모리 캐시                 │
│  - WebClient 비동기 호출              │
│  - Rate Limit / 에러 핸들링           │
└─────────────┬────────────────────────┘
              │ HTTPS + API Key
┌─────────────▼────────────────────────┐
│    넥슨 MapleStory Open API           │
└──────────────────────────────────────┘
```

---

## 주요 기능

### 캐릭터 정보 조회
- 닉네임 검색으로 캐릭터 기본 정보(레벨, 직업, 월드, 이미지) 조회
- 검색 히스토리 로컬 저장 및 삭제
- 전투력·주요 스탯 요약 표시

### 장비 정보 뷰어
- 메이플스토리 인게임과 동일한 슬롯 배치의 장비 그리드
- 마우스 호버 시 툴팁 (스타포스, 잠재옵션, 기본/추가/주문서 옵션 상세 표시)
- 클릭으로 툴팁 고정(pin), 재클릭으로 해제
- 잠재옵션 등급별 테두리 색상 (레어·에픽·유니크·레전드리)
- 안드로이드 장비 슬롯 연동

### 유니온 배치도
- 20×20 인터랙티브 그리드에 배치된 유니온 블록 시각화
- 직업군별 색상 구분 (전사/마법사/궁수/도적/해적)
- 좌측 캐릭터 목록에서 선택 시 배치도 하이라이트 연동
- 직업군·랭크 필터, 캐릭터명 검색
- 45초 자동 갱신 (실시간 폴링 토글)
- 컨테이너 크기에 따른 그리드 동적 스케일 조정

### 길드 정보 조회
- 길드명 + 월드명으로 길드 기본 정보 조회
- 캐릭터 조회 후 소속 길드 원클릭 바로가기

### 기타
- 다크/라이트 모드 토글 (localStorage 영속)
- 각 정보 섹션별 독립 에러 처리 및 재시도 버튼
- Electron으로 Windows 데스크탑 앱(.exe) 빌드

---

## 구현 포인트

### OCID 인메모리 캐시 (백엔드)
넥슨 API는 캐릭터 이름으로 직접 조회하지 않고, 먼저 고유 식별자(OCID)를 받아 이후 모든 요청에 사용하는 2-step 구조입니다.
같은 캐릭터를 반복 조회할 때마다 추가 API 요청이 발생하는 문제를 `ConcurrentHashMap` 기반 캐시로 해결했습니다.

```java
// NexonApiService.java
private final Map<String, String> ocidCache = new ConcurrentHashMap<>();

private String getOcid(String name) {
    return ocidCache.computeIfAbsent(name, n -> {
        CharacterOcid id = fetch("/maplestory/v1/id", CharacterOcid.class, "character_name", n);
        return id.getCharacterOcid();
    });
}
```

### 장비 슬롯 정규화 (프론트엔드)
넥슨 API가 반환하는 슬롯 이름이 "반지1", "반지 (1)", "반지(1)" 등 일관되지 않아 그리드 매핑에 실패하는 문제가 있었습니다.
숫자·공백·괄호를 제거하는 정규화 함수로 해결했습니다.

```js
// App.js
const normalizeSlot = (s) =>
  (s || "")
    .replace(/[0-9]/g, "")
    .replace(/\s+/g, "")
    .replace(/[()_-]/g, "")
    .trim();
```

### 유니온 그리드 동적 스케일
유니온 맵은 고정 20×20 그리드(18px/tile = 360px)이지만, 사이드바가 있는 레이아웃에서는 컨테이너가 더 좁아질 수 있습니다.
`useLayoutEffect`로 컨테이너 실측 크기를 읽어 `transform: scale()`로 동적 축소하여 가로 스크롤 없이 표시합니다.

### 병렬 API 호출 + 독립 에러 처리
캐릭터 조회 시 장비·스탯·어빌리티·성향·하이퍼스탯을 동시에 요청합니다.
각 항목이 개별 에러 상태를 가지므로 일부 API 실패가 전체 화면 오류로 번지지 않으며, 항목별 재시도 버튼을 제공합니다.

---

## 로컬 실행

### 사전 조건
- Java 17+
- Node.js 18+
- 넥슨 Open API 키 ([발급](https://openapi.nexon.com/))

### 백엔드
```bash
cd MapleChat_Back
# application.properties 또는 환경변수에 API 키 설정
# nexon.api-key=YOUR_API_KEY
./mvnw spring-boot:run
```

### 프론트엔드 (웹)
```bash
cd MapleChat_Front/frontend
npm install
npm start
# http://localhost:3000
```

### Electron 데스크탑 앱
```bash
cd MapleChat_Front/frontend
npm install
npm run electron:start
```

### Windows 인스톨러 빌드
```bash
npm run electron:build
# dist/ 폴더에 .exe 인스톨러 생성
```

---

## API 엔드포인트

백엔드 실행 후 Swagger UI에서 전체 API 목록을 확인할 수 있습니다.

```
http://localhost:8080/swagger-ui.html
```

| Method | Path | 설명 |
|---|---|---|
| GET | `/character/basic` | 캐릭터 기본 정보 |
| GET | `/character/equipment` | 장비 정보 |
| GET | `/character/stat` | 스탯 정보 |
| GET | `/character/hyper-stat` | 하이퍼스탯 |
| GET | `/character/ability` | 어빌리티 |
| GET | `/character/propensity` | 성향 |
| GET | `/character/android-equipment` | 안드로이드 장비 |
| GET | `/guild/basic` | 길드 기본 정보 |
| GET | `/union` | 유니온 정보 |
| GET | `/union/raider` | 유니온 블록 배치 |

---

## 디렉터리 구조

```
MapleChat_Back/
└── src/main/java/com/example/MapleChat/
    ├── controller/       # REST 컨트롤러 (Character, Guild, Union)
    ├── service/          # NexonApiService (WebClient + OCID 캐시)
    ├── dto/              # 넥슨 API 응답 DTO
    └── exception/        # 커스텀 예외 (Rate Limit, Not Found 등)

MapleChat_Front/frontend/src/
    ├── api/              # fetch 래퍼 (characterApi, guildApi 등)
    ├── components/       # UI 컴포넌트 (EquipmentTooltip, UnionMapViewer 등)
    ├── hooks/            # useCharacterData, useSearchHistory
    ├── utils/            # gameLogic, formatters, unionShapes
    ├── constants/        # equipmentSlots (장비 그리드 레이아웃 정의)
    └── types/            # unionTypes (직업군·랭크 상수)
```

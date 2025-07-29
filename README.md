
# 스팀 대시보드 (Steam Dashboard)

**스팀 대시보드**는 사용자의 Steam 프로필 데이터를 시각적으로 분석하고 탐색할 수 있는 인터랙티브 웹 애플리케이션입니다. API 키와 Steam ID를 입력하기만 하면, 게임 라이브러리, 플레이 시간 통계, 도전 과제 달성률 등 다양한 정보를 한눈에 확인할 수 있습니다.

실행주소1 : https://steam-board.vercel.app/

실행주소2 : https://dev-canvas-pi.vercel.app/

---

## ✨ 주요 기능

-   **사용자 프로필 요약**: 아바타, 닉네임, 온라인 상태, 레벨 및 경험치 진행 상황을 표시합니다.
-   **대시보드 통계**:
    -   모든 게임의 총 플레이 시간
    -   보유한 게임의 총개수
    -   가장 많이 플레이한 게임
    -   보유한 배지 개수
-   **인터랙티브 차트**: 상위 게임들의 플레이 시간 분포를 보여주는 원형 차트를 제공합니다.
-   **게임 라이브러리**:
    -   보유한 모든 게임을 카드 그리드 형식으로 탐색할 수 있습니다.
    -   **필터링**: 플레이한 게임 / 플레이하지 않은 게임으로 필터링
    -   **정렬**: 마지막 플레이, 총 플레이 시간, 이름순으로 정렬
    -   **검색**: 특정 게임을 이름으로 빠르게 검색
-   **게임 상세 정보**:
    -   게임을 클릭하면 상세 정보 모달이 나타납니다.
    -   **도전 과제**: 플레이어의 도전 과제 진행률 (달성 개수, 비율) 및 전체 목록을 표시합니다. 각 과제의 희귀도(전체 유저 달성률 기준), 달성 여부, 달성일 확인이 가능합니다.
    -   **최신 뉴스**: 해당 게임의 최신 스팀 뉴스를 바로 확인할 수 있습니다.
-   **랜덤 게임 추천**: "다음에 뭘 할까?" 고민될 때, 보유한 게임 중 하나를 랜덤으로 추천해 줍니다. (플레이하지 않은 게임 우선)
-   **최근 플레이 목록**: 최근 2주간 플레이한 게임 목록과 플레이 시간을 보여줍니다.
-   **반응형 디자인**: 데스크톱, 태블릿, 모바일 등 다양한 기기에서 최적화된 화면을 제공합니다.
-   **데이터 캐싱**: 빠른 로딩을 위해 사용자의 데이터를 브라우저(`localStorage`)에 캐싱하여 API 호출을 최소화합니다.

---

## 🚀 사용 방법

이 애플리케이션을 사용하려면 두 가지 정보가 필요합니다: **Steam Web API 키**와 **SteamID64**입니다.

### 1. Steam Web API 키 발급받기

1.  [Steam 개발자 커뮤니티 페이지](https://steamcommunity.com/dev/apikey)에 방문하여 Steam 계정으로 로그인합니다.
2.  도메인 이름을 입력하라는 창이 나타납니다. 아무 이름이나 (예: `localhost`) 입력하고 약관에 동의한 후 **'등록'** 버튼을 클릭합니다.
3.  발급된 API 키를 복사합니다.

### 2. 대시보드에 정보 입력하기

1.  애플리케이션을 처음 실행하면 API 키를 입력하는 화면이 나타납니다. 복사한 키를 붙여넣고 **'키 저장 및 시작하기'**를 클릭하세요.
    -   *참고: API 키는 사용자의 브라우저에만 안전하게 저장되며, 외부 서버로 전송되지 않습니다.*
2.  다음으로, 본인의 **SteamID64**를 입력하는 검색창이 나타납니다.
    -   SteamID64는 `7656...`으로 시작하는 17자리 숫자입니다.
    -   본인의 SteamID64를 모른다면 [SteamID Finder](https://www.steamidfinder.com/)와 같은 웹사이트에서 프로필 주소나 커스텀 URL을 입력하여 찾을 수 있습니다.
3.  SteamID64를 입력하고 **'검색'** 버튼을 누르면 대시보드가 로드됩니다.

---

## 🛠️ 기술 스택

-   **프레임워크**: React `19.x`
-   **언어**: TypeScript
-   **스타일링**: Tailwind CSS
-   **애니메이션**: Framer Motion
-   **차트**: Recharts
-   **모듈 시스템**: Native ES Modules with `importmap` (별도의 빌드 과정 없이 브라우저에서 직접 실행)

---

## 📂 프로젝트 구조

```
.
├── components/         # 재사용 가능한 리액트 컴포넌트
│   ├── ApiKeyInput.tsx
│   ├── DashboardWidgets.tsx
│   ├── GameCard.tsx
│   ├── GameDetailModal.tsx
│   ├── GameGrid.tsx
│   ├── Icons.tsx
│   ├── RecommendationModal.tsx
│   ├── SteamIdInput.tsx
│   └── UserProfileCard.tsx
├── services/           # API 호출 로직
│   └── steamService.ts
├── App.tsx             # 메인 애플리케이션 컴포넌트
├── constants.ts        # API 엔드포인트 등 상수
├── index.html          # HTML 진입점 및 importmap 설정
├── index.tsx           # React 애플리케이션 마운트
├── metadata.json       # 프로젝트 메타데이터
├── README.md           # 프로젝트 설명 파일 (현재 파일)
└── types.ts            # TypeScript 타입 정의
```

---

## ⚠️ API 사용 참고사항

브라우저에서 직접 Steam API를 호출할 때 발생하는 CORS(Cross-Origin Resource Sharing) 문제를 해결하기 위해 `cors.eu.org`라는 오픈 소스 CORS 프록시를 사용하고 있습니다. 이 프록시는 때때로 불안정할 수 있으며, 이로 인해 데이터 로딩에 실패할 수 있습니다. 이는 클라이언트 측에서만 작동하는 애플리케이션의 한계입니다.

---

## 📄 고지 사항

This project is powered by the Steam Web API. It is not affiliated with Valve Corp.

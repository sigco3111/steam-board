# 🎮 Steam Board

> Steam Web API를 활용한 개인 게임 대시보드

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

Steam Board는 Steam Web API를 이용하여 사용자의 게임 활동을 시각화하고 분석할 수 있는 개인화된 대시보드입니다. 게임 라이브러리 관리, 플레이 통계 분석, 친구들과의 비교 등 다양한 기능을 제공합니다.

## ✨ 주요 기능

### 🎯 핵심 기능 (MVP)
- **Steam 로그인**: Steam OpenID를 통한 안전한 인증
- **프로필 대시보드**: 사용자 기본 정보 및 요약 통계
- **게임 라이브러리**: 보유 게임 목록 및 플레이 시간 조회
- **기본 통계**: 총 게임 수, 플레이 시간, 최근 활동
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

### 📊 고급 기능 (계획)
- **상세 통계 분석**: 게임별, 장르별, 시간대별 플레이 패턴
- **친구 기능**: 친구 목록, 활동 비교, 리더보드
- **게임 추천**: 개인화된 게임 추천 시스템
- **성취도 추적**: 게임별 성취도 진행률 및 분석
- **목표 설정**: 개인 게임 목표 설정 및 추적

## 🛠 기술 스택

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/UI
- **State Management**: Zustand / React Query
- **Charts**: Chart.js / Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL / SQLite
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Steam Provider)
- **Cache**: Redis (선택사항)

### DevOps & Tools
- **Hosting**: Vercel / Netlify
- **Database**: Supabase / PlanetScale
- **Monitoring**: Sentry
- **Analytics**: Google Analytics 4

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn 패키지 매니저
- Steam Web API Key ([발급 방법](#steam-api-key-발급))

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/your-username/steam-board.git
cd steam-board
```

2. **의존성 설치**
```bash
npm install
# 또는
yarn install
```

3. **환경 변수 설정**
```bash
cp .env.example .env.local
```

`.env.local` 파일을 편집하여 필요한 환경 변수를 설정합니다:

```env
# Steam Web API Key
STEAM_API_KEY=your_steam_api_key_here

# NextAuth.js 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# 데이터베이스 (개발용 SQLite)
DATABASE_URL="file:./dev.db"

# Steam OpenID 설정
STEAM_OPENID_REALM=http://localhost:3000
STEAM_OPENID_RETURN_TO=http://localhost:3000/auth/steam/return
```

4. **데이터베이스 초기화**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **개발 서버 실행**
```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 🔑 Steam API Key 발급

1. [Steam Web API Key 페이지](https://steamcommunity.com/dev/apikey)에 접속
2. Steam 계정으로 로그인
3. 도메인 이름 입력 (개발 시: `localhost:3000`)
4. 약관 동의 후 API Key 발급
5. 발급받은 키를 `.env.local`의 `STEAM_API_KEY`에 설정

⚠️ **주의사항**: API Key는 절대 클라이언트 사이드에 노출하지 마세요!

## 📁 프로젝트 구조

```
steam-board/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── auth/              # 인증 관련 페이지
│   │   ├── dashboard/         # 대시보드 페이지
│   │   └── layout.tsx         # 루트 레이아웃
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── ui/               # 기본 UI 컴포넌트
│   │   ├── dashboard/        # 대시보드 관련 컴포넌트
│   │   └── charts/           # 차트 컴포넌트
│   ├── lib/                  # 유틸리티 함수 및 설정
│   │   ├── auth.ts           # NextAuth 설정
│   │   ├── steam-api.ts      # Steam API 클라이언트
│   │   ├── db.ts            # 데이터베이스 설정
│   │   └── utils.ts         # 공통 유틸리티
│   ├── hooks/               # 커스텀 React 훅
│   ├── types/               # TypeScript 타입 정의
│   └── store/               # 상태 관리 (Zustand)
├── prisma/                  # 데이터베이스 스키마
├── public/                  # 정적 파일
├── docs/                    # 프로젝트 문서
└── README.md
```

## 🔧 개발 가이드

### 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 타입 체크
npm run type-check

# 린팅
npm run lint

# 포맷팅
npm run format

# 테스트 실행
npm run test

# 데이터베이스 마이그레이션
npx prisma migrate dev

# Prisma Studio 실행
npx prisma studio
```

### 코딩 컨벤션

#### 파일 및 폴더 명명

- **컴포넌트**: PascalCase (예: `GameLibrary.tsx`)
- **페이지**: kebab-case (예: `user-profile/page.tsx`)
- **유틸리티**: camelCase (예: `steamApi.ts`)
- **상수**: UPPER_SNAKE_CASE (예: `MAX_RETRY_COUNT`)

#### 컴포넌트 작성 가이드

```typescript
// 컴포넌트 파일 상단에 목적 설명 추가
/**
 * 사용자의 게임 라이브러리를 표시하는 컴포넌트
 * Steam API에서 받은 게임 목록을 카드 형태로 렌더링
 */

interface GameLibraryProps {
  userId: string;
  sortBy?: 'playtime' | 'name' | 'recent';
}

export function GameLibrary({ userId, sortBy = 'playtime' }: GameLibraryProps) {
  // 복잡한 로직에는 주석 추가
  const { games, isLoading, error } = useGameLibrary(userId);

  // 에러 처리 필수
  if (error) {
    console.error('게임 라이브러리 로딩 실패:', error);
    return <ErrorMessage message="게임 목록을 불러올 수 없습니다." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {games?.map((game) => (
        <GameCard key={game.appid} game={game} />
      ))}
    </div>
  );
}
```

#### API 라우트 작성 가이드

```typescript
// API 엔드포인트 목적 설명
/**
 * Steam 사용자의 보유 게임 목록을 조회하는 API
 * Steam Web API의 GetOwnedGames 엔드포인트를 프록시
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { steamApi } from '@/lib/steam-api';

export async function GET(request: NextRequest) {
  try {
    // 인증 상태 확인
    const session = await getServerSession();
    if (!session?.user?.steamId) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    // Steam API 호출
    const games = await steamApi.getOwnedGames(session.user.steamId);
    
    return NextResponse.json({ games });
  } catch (error) {
    console.error('게임 목록 조회 실패:', error);
    return NextResponse.json(
      { error: '게임 목록을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}
```

### Steam API 사용법

#### 주요 API 엔드포인트

```typescript
import { steamApi } from '@/lib/steam-api';

// 사용자 프로필 정보
const profile = await steamApi.getPlayerProfile(steamId);

// 보유 게임 목록
const games = await steamApi.getOwnedGames(steamId);

// 최근 플레이 게임
const recentGames = await steamApi.getRecentlyPlayedGames(steamId);

// 친구 목록
const friends = await steamApi.getFriendList(steamId);

// 게임 성취도
const achievements = await steamApi.getPlayerAchievements(steamId, appId);
```

#### Rate Limiting 고려사항

```typescript
// 캐싱을 통한 API 호출 최적화
const getCachedGameData = async (steamId: string) => {
  const cacheKey = `games:${steamId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const games = await steamApi.getOwnedGames(steamId);
  await redis.setex(cacheKey, 3600, JSON.stringify(games)); // 1시간 캐시
  
  return games;
};
```

## 🧪 테스트

### 테스트 실행

```bash
# 모든 테스트 실행
npm run test

# 감시 모드로 테스트 실행
npm run test:watch

# 커버리지 리포트 생성
npm run test:coverage
```

### 테스트 작성 예시

```typescript
// components/__tests__/GameCard.test.tsx
import { render, screen } from '@testing-library/react';
import { GameCard } from '../GameCard';

const mockGame = {
  appid: 730,
  name: 'Counter-Strike 2',
  playtime_forever: 1200,
  img_icon_url: 'icon_hash',
};

describe('GameCard', () => {
  it('게임 정보를 올바르게 표시한다', () => {
    render(<GameCard game={mockGame} />);
    
    expect(screen.getByText('Counter-Strike 2')).toBeInTheDocument();
    expect(screen.getByText('20.0 시간')).toBeInTheDocument();
  });
});
```

## 🚀 배포

### Vercel 배포 (권장)

1. **Vercel CLI 설치**
```bash
npm i -g vercel
```

2. **프로젝트 배포**
```bash
vercel
```

3. **환경 변수 설정**
Vercel 대시보드에서 다음 환경 변수를 설정:
- `STEAM_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `DATABASE_URL`

### Docker 배포

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Docker 이미지 빌드 및 실행
docker build -t steam-board .
docker run -p 3000:3000 steam-board
```

## 🤝 기여하기

### 기여 방법

1. **Fork** 프로젝트를 포크합니다
2. **Branch** 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. **Commit** 변경사항을 커밋합니다 (`git commit -m 'Add: 새로운 기능 추가'`)
4. **Push** 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. **Pull Request** 를 생성합니다

### 커밋 메시지 규칙

```
타입: 간단한 설명

상세한 설명 (선택사항)

Fixes #이슈번호 (해당하는 경우)
```

**타입 종류:**
- `Feat`: 새로운 기능 추가
- `Fix`: 버그 수정
- `Docs`: 문서 변경
- `Style`: 코드 포맷팅, 세미콜론 누락 등
- `Refactor`: 코드 리팩토링
- `Test`: 테스트 코드 추가/수정
- `Chore`: 빌드 과정, 패키지 매니저 설정 등

### 이슈 보고

버그를 발견하거나 새로운 기능을 제안하고 싶다면:

1. [Issues](https://github.com/your-username/steam-board/issues)에서 기존 이슈 확인
2. 새로운 이슈 생성 시 제공된 템플릿 사용
3. 가능한 한 자세한 정보 제공

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.

## 🙏 감사의 말

- [Steam Web API](https://steamcommunity.com/dev) - 게임 데이터 제공
- [Next.js](https://nextjs.org/) - 웹 프레임워크
- [Tailwind CSS](https://tailwindcss.com/) - UI 스타일링
- [Shadcn/UI](https://ui.shadcn.com/) - UI 컴포넌트 라이브러리
- [Chart.js](https://www.chartjs.org/) - 데이터 시각화

## 📞 연락처

- **개발자**: [Your Name](mailto:your.email@example.com)
- **프로젝트 링크**: [https://github.com/your-username/steam-board](https://github.com/your-username/steam-board)
- **라이브 데모**: [https://steam-board.vercel.app](https://steam-board.vercel.app)

---

⭐ 이 프로젝트가 유용하다면 별표를 눌러주세요!

**Made with ❤️ for Steam Gamers** 
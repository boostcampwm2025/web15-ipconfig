# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프론트엔드 개요

React 19 + TypeScript + Vite 기반 SPA. `/` (랜딩)과 `/workspace/:workspaceId` (협업 워크스페이스) 두 개의 라우트로 구성됩니다.

## 명령어

```bash
npm run dev           # Vite 개발 서버 (0.0.0.0 바인딩)
npm run build         # tsc -b && vite build
npm run lint          # ESLint
npm run test          # Vitest 단위 테스트 (1회 실행)
npm run test:watch    # Vitest watch 모드
npm run storybook     # Storybook (포트 6006)
npm run test:storybook  # Storybook 스냅샷 테스트
```

단일 테스트 파일 실행:
```bash
npx vitest run src/path/to/file.test.ts
```

## 디렉토리 구조

```
src/
├── pages/            # 라우팅 단위 페이지
│   ├── landing/      # 워크스페이스 생성/참여
│   ├── workspace/    # 메인 협업 워크스페이스
│   └── error/
├── features/         # 기능 단위 모듈
│   ├── widgets/      # 위젯 컴포넌트 (Yjs 연동)
│   ├── yjs/          # Yjs 동기화, awareness, 액션
│   ├── export/       # 마크다운/설정파일 내보내기
│   ├── initialSetup/ # 초기 설정 UI
│   ├── userListCard/ # 사용자 목록 (접속자 표시)
│   └── tour/         # 온보딩 가이드 투어
├── common/
│   ├── api/          # Axios 클라이언트, API 함수
│   ├── store/        # Zustand 전역 상태
│   ├── hooks/        # 커스텀 훅
│   ├── components/   # 재사용 UI 컴포넌트
│   ├── contexts/     # React Context (ThemeProvider 등)
│   ├── types/        # 공통 TypeScript 타입
│   ├── schemas/      # Zod 유효성 검사 스키마
│   └── lib/          # 유틸리티 라이브러리
└── utils/            # 범용 유틸리티 함수
```

경로 별칭: `@/` → `src/`

## 핵심 개념

### API 클라이언트

`common/api/apiClient.ts` — Axios 인스턴스:
- 개발 환경: `http://localhost:3000` 사용
- 프로덕션: `window.location.origin` 사용 (Nginx 프록시 경유)
- 환경변수 `VITE_BACKEND_URL`로 오버라이드 가능
- 타임아웃 10초, 응답 인터셉터로 에러 처리

### 상태 관리

Zustand 스토어 두 개:
- **`store/user.ts`** — 현재 사용자 ID, 전체 사용자 목록, 커서 정보. 전용 선택자 훅 제공 (`useMyCursorType`, `useOtherUserList`, `useUserCursorById`)
- **`store/workspace.ts`** — 워크스페이스 ID/이름, 위젯 목록 CRUD. devtools 미들웨어 포함

### 실시간 협업 (Yjs)

`features/yjs/`에서 Yjs 문서 동기화를 담당:
- `HocuspocusProvider`로 백엔드 `/collaboration` WebSocket에 연결
- 위젯 상태를 Yjs shared type으로 관리 → 자동 CRDT 병합
- awareness로 커서 위치 및 사용자 존재감 공유

### 위젯 시스템

`features/widgets/`의 위젯은 dnd-kit으로 드래그앤드롭을 지원하며, 상태는 Zustand가 아닌 Yjs 문서에 직접 저장됩니다.

### 테마

`common/contexts/ThemeProvider.tsx` — sessionStorage 기반 라이트/다크 테마 Context.

## 테스트

Vitest 멀티 프로젝트 설정 (`vite.config.ts`):
- **`unit`** 프로젝트: `src/**/*.test.ts`, Node 환경
- **`storybook`** 프로젝트: Playwright + Chromium 브라우저 환경

## 주요 라이브러리

| 라이브러리 | 용도 |
|-----------|------|
| `yjs` + `@hocuspocus/provider` | 실시간 CRDT 협업 |
| `zustand` | 전역 상태 관리 |
| `@dnd-kit/core`, `@dnd-kit/sortable` | 드래그앤드롭 |
| `react-hook-form` + `zod` | 폼 유효성 검사 |
| `tailwindcss` v4 + Radix UI | UI 스타일링/컴포넌트 |
| `react-markdown` + `remark-gfm` | 마크다운 렌더링 |
| `sonner` | 토스트 알림 |
| `motion` | 애니메이션 |

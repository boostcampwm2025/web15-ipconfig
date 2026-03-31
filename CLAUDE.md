# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**team.config**는 실시간 협업 팀 설정 플랫폼입니다. 팀원들이 위젯 기반으로 의사결정을 내리고(Yjs CRDT + WebSocket), 그 결과를 마크다운 문서나 설정 파일(Prettier, Dockerfile 등)로 내보낼 수 있습니다.

npm workspaces 기반 TypeScript 모노레포로 두 개의 패키지로 구성됩니다:
- `frontend/` — React 19 + Vite + Yjs
- `backend/` — NestJS 11 + Hocuspocus + Redis

## 명령어

### 루트에서 실행

```bash
npm run dev:fe        # 프론트엔드 개발 서버
npm run dev:be        # 백엔드 개발 서버
npm run lint          # 프론트엔드 + 백엔드 전체 린트
npm run format        # 전체 파일 Prettier 포맷팅
```

### 프론트엔드 (`cd frontend` 또는 `-w frontend`)

```bash
npm run dev           # Vite 개발 서버
npm run build         # TypeScript 검사 + Vite 빌드
npm run lint          # ESLint
npm run test          # Vitest 단위 테스트 (1회 실행)
npm run test:watch    # Vitest 단위 테스트 (watch 모드)
npm run storybook     # Storybook (포트 6006)
```

### 백엔드 (`cd backend` 또는 `-w backend`)

```bash
npm run start:dev     # NestJS watch 모드
npm run build         # TypeScript 컴파일
npm run lint          # ESLint (자동 수정 포함)
npm run test          # Jest 단위 테스트
npm run test:watch    # Jest watch 모드
npm run test:cov      # Jest 커버리지
npm run test:e2e      # E2E 테스트 (jest-e2e.json)
```

## 아키텍처

### 요청 흐름

```
브라우저 → Nginx → /api/*         → backend:3000 (REST, NestJS)
                → /collaboration  → backend:3000 (WebSocket, Hocuspocus)
                → /               → Nginx 정적 파일 (React dist)
```

### 실시간 협업 (핵심 기능)

**Yjs CRDT + Hocuspocus WebSocket** 기반의 실시간 동기화:

- 프론트엔드: `Y.Doc`를 생성하고 `/collaboration` 경로로 `HocuspocusProvider` 연결
- 위젯 상태(의사결정, 선택값)를 Yjs shared type으로 저장 → 연결된 모든 클라이언트에 자동 동기화
- 백엔드: 동일 포트에서 Hocuspocus 서버로 WebSocket 처리 (NestJS 표준 WebSocket 아님)
- Redis(`@hocuspocus/extension-redis`)로 문서 상태 공유 → 다중 백엔드 인스턴스 수평 확장 가능
- 문서명 포맷: `workspace:${workspaceId}`

### 백엔드 모듈 구조

| 모듈 | 경로 | 역할 |
|------|------|------|
| `collaboration` | `backend/src/collaboration/` | Hocuspocus WebSocket 서버, Yjs 문서 관리 |
| `workspace` | `backend/src/workspace/` | 워크스페이스 생성/참여 (REST) |
| `markdown` | `backend/src/markdown/` | Yjs 위젯 데이터 → 마크다운 변환 (builder 패턴) |
| `project-setup` | `backend/src/project-setup/` | 설정 파일(Prettier, Dockerfile 등) 생성 |

### 프론트엔드 구조

| 디렉토리 | 역할 |
|----------|------|
| `features/widgets/` | 위젯 컴포넌트 (dnd-kit 드래그앤드롭, Yjs 연동 상태) |
| `features/yjs/` | Yjs 동기화, awareness(커서 존재감), 문서 액션 |
| `features/export/` | 마크다운 내보내기 UI |
| `common/api/` | Axios 클라이언트, 워크스페이스 API |
| `common/store/` | Zustand 전역 상태 (user, workspace) |
| `common/hooks/` | 협업/워크스페이스/기능별 커스텀 훅 |
| `pages/` | 라우팅 단위 페이지 (landing, workspace, error) |

경로 별칭: `@/` → `frontend/src/`

## 커밋 메시지 규칙

커밋 메시지는 **반드시 한국어**로 작성하며 Conventional Commits 형식을 따릅니다:

```
type(scope): 한국어 요약

- 변경 이유
- 영향 범위
- 테스트 방법
```

허용 타입: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`, `ci`, `build`

최종 커밋 메시지만 출력합니다 (설명이나 부연 없이).

예시:
- `feat(auth): 로그인 실패 시 안내 문구 개선`
- `fix: 커서 위치 불일치 현상 수정`

## 인프라

**Docker Compose 파일:**
- `docker-compose.yml` — 로컬 개발 (frontend + backend + Redis)
- `docker-compose.webserver.yml` / `docker-compose.was.yml` / `docker-compose.redis.yml` — 프로덕션 서비스별 파일

**프로덕션 빌드:** `dockerfile.prod` — 멀티스테이지 빌드로 Nginx(프론트엔드)와 Node(백엔드) 이미지 각각 생성

**CI/CD:** GitHub Actions (`.github/workflows/`)
- `ci.yml` — main 브랜치 push/PR 시 lint + test + build 검증
- `deploy.yml` — Docker 이미지 빌드 → GHCR 푸시 → AWS 인스턴스 배포 + 헬스체크

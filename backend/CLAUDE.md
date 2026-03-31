# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 백엔드 개요

NestJS 11 + TypeScript 기반 서버. REST API와 Hocuspocus WebSocket 서버를 동일 포트(기본 3000)에서 실행합니다.

## 명령어

```bash
npm run start:dev     # NestJS watch 모드
npm run build         # nest build (TypeScript 컴파일)
npm run lint          # ESLint (자동 수정 포함)
npm run test          # Jest 단위 테스트
npm run test:watch    # Jest watch 모드
npm run test:cov      # Jest 커버리지
npm run test:e2e      # E2E 테스트 (test/jest-e2e.json)
```

단일 테스트 파일 실행:
```bash
npx jest src/path/to/file.spec.ts
```

Swagger 문서: 개발 서버 실행 후 `http://localhost:3000/api-docs`

## 모듈 구조

```
src/
├── app.module.ts         # 루트 모듈 (ConfigModule, Winston, 전체 미들웨어)
├── main.ts               # 부트스트랩 (CORS, ValidationPipe, Hocuspocus 업그레이드 핸들러)
├── collaboration/        # WebSocket 협업 모듈
├── workspace/            # 워크스페이스 관리 모듈
├── markdown/             # 마크다운 변환 모듈
├── project-setup/        # 설정 파일 생성 모듈
└── common/
    ├── logger/           # Winston 로거 설정
    ├── filters/          # 전역 예외 필터
    ├── middlewares/      # 로거 미들웨어
    └── constants/        # 공통 상수
```

## 핵심 개념

### Hocuspocus WebSocket (협업 핵심)

NestJS 표준 WebSocket 게이트웨이를 사용하지 않습니다. `main.ts`에서 HTTP 서버의 `upgrade` 이벤트를 직접 가로채 `/collaboration` 경로의 WebSocket 요청을 Hocuspocus로 라우팅합니다:

```typescript
// main.ts
httpServer.on('upgrade', (request, socket, head) => {
  if (request.url?.startsWith('/collaboration')) {
    collaborationService.handleUpgrade(request, socket, head);
  }
});
```

`collaboration.service.ts`에서 Hocuspocus 인스턴스를 관리합니다:
- **Database extension**: Redis 기반 문서 영속성
- **Redis extension**: 다중 서버 인스턴스 간 문서 상태 동기화 (환경변수로 활성화)
- 문서명 포맷: `workspace:${workspaceId}`
- 저장 디바운스: 2초 (최대 10초)

### 워크스페이스 모듈

`workspace/workspace.service.ts`의 핵심 구조:

```typescript
// 사용자 세션: socketId → 사용자 정보 매핑
UserSession { socketId, roomId, user: { id, nickname, color } }

// 워크스페이스: 메모리 우선, Redis에서 지연 로드
WorkspaceInfo { expirationTime }
```

- 워크스페이스 TTL: 3일
- 닉네임: `ko-nickname` 라이브러리로 한국어 자동 생성
- 워크스페이스 ID: `nanoid`로 생성 (커스텀 알파벳, 상수로 정의)

### 마크다운 모듈

`markdown/builders/` — 위젯 타입별 마크다운 빌더 패턴으로 구현. 새 위젯 타입 추가 시 빌더를 추가하면 확장됩니다.

### 환경 설정

`app.module.ts`에서 `joi`로 환경변수 유효성 검사. `.env` 파일로 설정 주입, 필수 환경변수가 없으면 애플리케이션 시작 실패.

### 로깅

Winston + `winston-daily-rotate-file` 사용. `LoggerMiddleware`가 모든 라우트에 적용되어 HTTP 요청 로깅. 로그 파일은 일별 로테이션.

## REST API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/workspace` | 워크스페이스 생성 (선택적 커스텀 ID) |
| `POST` | `/workspace/join` | 기존 워크스페이스 참여 |
| `GET` | `/workspace/check/:workspaceId` | 워크스페이스 존재 여부 확인 |
| `GET` | `/markdown?workspaceId=<id>` | 워크스페이스 → 마크다운 변환 |

## 테스트

Jest 설정 (`package.json`):
- `rootDir`: `src`
- 테스트 파일 패턴: `*.spec.ts`
- 변환: `ts-jest`
- 테스트 환경: Node

단위 테스트는 `__test__/` 또는 같은 디렉토리의 `.spec.ts` 파일에 위치합니다.

---
name: frontend-test
description: >
  이 프로젝트(team.config) frontend/ 디렉토리의 React 컴포넌트·훅·유틸 테스트 작성 스킬.
  Vitest + React Testing Library 기반으로 단위 테스트(.test.ts)와 컴포넌트 테스트(.test.tsx)를 작성한다.
  frontend/ 경로에서 "테스트 작성해줘", "테스트 추가해줘", "이 훅/컴포넌트 테스트하고 싶어",
  "테스트 전략", "TDD", "vitest", "testing library", "mock 어떻게 해", "테스트 개선"
  등을 언급하면 반드시 이 스킬을 사용할 것.
  백엔드(NestJS/Jest) 테스트 요청에는 사용하지 않는다.
---

# 프론트엔드 테스트 스킬

## 이 프로젝트의 테스트 구조

두 가지 파일 패턴으로 테스트 환경이 자동으로 분리된다:

| 파일 패턴           | 환경  | 용도                           |
| ------------------- | ----- | ------------------------------ |
| `src/**/*.test.ts`  | Node  | Yjs CRDT, 유틸 함수, 순수 로직 |
| `src/**/*.test.tsx` | jsdom | React 컴포넌트, 커스텀 훅      |

**핵심**: `.ts`인지 `.tsx`인지가 환경을 결정한다. DOM이 필요하면 `.test.tsx`, 아니면 `.test.ts`.

---

## 테스트 작성 시작 전 판단 흐름

```
테스트 대상이 무엇인가?
│
├─ Yjs 문서 조작 / 유틸 함수 / 순수 TS 로직
│   └─ *.test.ts (Node 환경)
│
├─ React 컴포넌트 / 커스텀 훅
│   └─ *.test.tsx (jsdom 환경)
│       ├─ render, screen, userEvent 사용
│       └─ Provider가 필요하면 renderWithProviders 활용
│
└─ API 호출이 포함된 경우
    └─ vi.mock으로 모듈 격리 → reference/mocking.md 참조
```

---

## 테스트 실행

```bash
# 전체 (unit + component)
npm run test

# 단위 테스트만
npx vitest run --project unit

# 컴포넌트 테스트만
npx vitest run --project component

# 단일 파일
npx vitest run src/path/to/file.test.tsx
```

---

## 핵심 원칙 요약

자세한 내용은 `reference/testing-principle.md`를 읽는다.

- **AAA 패턴**: Arrange / Act / Assert 세 단계를 빈 줄로 구분
- **동작 기반**: 내부 state/ref가 아닌 사용자가 볼 수 있는 출력을 검증
- **쿼리 우선순위**: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`(최후 수단)
- **테스트 이름**: `describe('컴포넌트명') + it('시나리오_기대결과')`
- **테스트 내 로직 금지**: if/for/try-catch는 테스트 신뢰성을 깨뜨린다

---

## 컴포넌트 테스트 필수 임포트

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
```

패턴별 코드 예시는 `reference/component-testing.md`를 참조한다.

---

## 모킹 전략

```ts
// 모듈 전체 mock
vi.mock(import('../api/workspaceApi'), () => ({
  createWorkspace: vi.fn().mockResolvedValue({ id: '123' }),
}));

// 타이머 mock (Yjs focusedAt 등 Date.now() 의존 로직)
beforeEach(() => vi.useFakeTimers({ now: 0 }));
afterEach(() => vi.useRealTimers());

// 브라우저 API mock (jsdom에 없는 API)
vi.stubGlobal(
  'ResizeObserver',
  vi.fn(
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  ),
);
```

상세 패턴은 `reference/mocking.md`를 참조한다.

---

## 이 프로젝트의 테스트 우선순위

이 프로젝트에서 특히 중요한 테스트 영역:

1. **Yjs CRDT 동작** — 동시성, eventual consistency, 위젯 상태 수렴 (`*.test.ts`)
2. **위젯 컴포넌트** — props에 따른 렌더링, 사용자 인터랙션 (`*.test.tsx`)
3. **커스텀 훅** — `useWidget`, `useWorkspace` 등 상태 로직 (`*.test.tsx`)
4. **폼 컴포넌트** — 랜딩 페이지 워크스페이스 생성/참여 (`*.test.tsx`)

---

## 참고 문서

| 문서                             | 내용                                              |
| -------------------------------- | ------------------------------------------------- |
| `reference/testing-principle.md` | 테스트 철학, AAA, EXIT POINT, 안티패턴 체크리스트 |
| `reference/setup.md`             | Vitest 설정, 패키지 목록, 실행 명령어             |
| `reference/component-testing.md` | RTL 패턴 모음 (렌더링/폼/훅/접근성)               |
| `reference/mocking.md`           | vi.fn/vi.mock/타이머/전역 객체 mock               |
| `reference/snapshot.md`          | 스냅샷 테스트 (사용 시기와 피해야 할 경우)        |

# Vitest 설정 가이드 (이 프로젝트 기준)

> `frontend/vite.config.ts` 멀티 프로젝트 설정 기반

## 현재 테스트 프로젝트 구조

이 프로젝트는 세 가지 테스트 프로젝트를 분리해서 운영한다.

```ts
test: {
  projects: [
    // 1. 단위 테스트: Node 환경, 순수 TS 로직
    {
      extends: true,
      test: {
        name: 'unit',
        include: ['src/**/*.test.ts'],   // ← .tsx 아님
        environment: 'node',
        globals: true,
      },
    },
    // 2. 컴포넌트 테스트: jsdom + React Testing Library
    {
      extends: true,
      test: {
        name: 'component',
        include: ['src/**/*.test.tsx'],  // ← .tsx
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
      },
    },
    // 3. Storybook 테스트: 실제 Chromium 브라우저
    { ... },
  ],
},
```

---

## 파일 패턴별 테스트 트랙

| 파일 패턴 | 프로젝트 | 환경 | 용도 |
|-----------|----------|------|------|
| `*.test.ts` | unit | Node | Yjs, 유틸, 순수 로직 |
| `*.test.tsx` | component | jsdom | React 컴포넌트, 커스텀 훅 |
| `*.stories.tsx` | storybook | Chromium | 시각적 회귀, 접근성 |

---

## setup 파일 (`src/test/setup.ts`)

컴포넌트 테스트 프로젝트의 setupFiles에서 로드되는 파일이다.

```ts
// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup(); // 각 테스트 후 DOM 정리
});
```

---

## 설치된 테스트 패키지

```
vitest ^4.0.x
@testing-library/react
@testing-library/jest-dom
@testing-library/user-event
@testing-library/dom
jsdom
@vitest/browser-playwright    ← Storybook용
```

---

## 실행 명령어

```bash
# 전체 실행
npm run test

# 단위 테스트만
npx vitest run --project unit

# 컴포넌트 테스트만
npx vitest run --project component

# 단일 파일
npx vitest run src/path/to/file.test.ts
npx vitest run src/path/to/component.test.tsx
```

---

## tsconfig 설정

`globals: true`를 사용하므로 타입 에러를 막으려면 추가가 필요하다:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

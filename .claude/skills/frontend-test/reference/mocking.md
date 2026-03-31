# Vitest 모킹 가이드 (리액트 테스트 중심)

> 출처: Vitest v4.x 공식 문서 (https://vitest.dev/guide/mocking 및 하위 페이지들)

## 목차

1. [모킹 기본 원칙](#모킹-기본-원칙)
2. [함수 모킹 (vi.fn, vi.spyOn)](#함수-모킹)
3. [모듈 모킹 (vi.mock)](#모듈-모킹)
4. [타이머 모킹 (vi.useFakeTimers)](#타이머-모킹)
5. [네트워크 요청 모킹 (MSW)](#네트워크-요청-모킹)
6. [전역 객체 모킹](#전역-객체-모킹)
7. [환경 변수 모킹](#환경-변수-모킹)
8. [Vitest 4 변경사항](#vitest-4-변경사항)

---

## 모킹 기본 원칙

모든 모킹은 테스트 간 상태가 공유되지 않도록 반드시 초기화해야 한다. `vi.restoreAllMocks()`나 `vi.resetAllMocks()`를 `beforeEach` 또는 `afterEach`에서 호출하거나, config에서 `mockReset: true` 또는 `restoreMocks: true`를 설정한다.

```ts
import { afterEach, vi } from 'vitest';

afterEach(() => {
  vi.restoreAllMocks(); // 원래 구현으로 복원
  // 또는 vi.resetAllMocks()  // 구현을 초기화하고 호출 기록 삭제
  // 또는 vi.clearAllMocks()  // 호출 기록만 삭제
});
```

config에서 전역 설정하는 방법:

```ts
export default defineConfig({
  test: {
    // 매 테스트 전 자동으로 mock 상태를 리셋
    mockReset: true,
  },
});
```

---

## 함수 모킹

### vi.fn() — 새로운 모킹 함수 생성

콜백 함수나 이벤트 핸들러가 올바르게 호출되었는지 검증할 때 사용한다.

```ts
import { expect, it, vi } from 'vitest'

it('콜백 함수가 올바른 인자로 호출된다', () => {
  const callback = vi.fn()

  // 컴포넌트에 콜백을 전달
  render(<Button onClick={callback} />)

  // 클릭 후 검증
  fireEvent.click(screen.getByRole('button'))

  expect(callback).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenCalledWith(expect.any(Object))  // 이벤트 객체
})
```

### vi.fn()에 구현 제공하기

```ts
// 기본 반환값 설정
const getUser = vi.fn().mockReturnValue({ name: '홍길동' });

// 비동기 함수 모킹
const fetchData = vi.fn().mockResolvedValue({ data: [1, 2, 3] });

// 한 번만 특정 값을 반환하도록 설정
const randomFn = vi
  .fn()
  .mockReturnValueOnce(42) // 첫 번째 호출
  .mockReturnValueOnce(99) // 두 번째 호출
  .mockReturnValue(0); // 이후 모든 호출
```

### vi.spyOn() — 기존 객체의 메서드를 감시

원래 구현을 유지하면서 호출 여부를 추적하거나, 필요시 구현을 대체할 수 있다.

```ts
import * as api from './api';

// 원래 구현을 유지하면서 호출 추적
const spy = vi.spyOn(api, 'fetchUser');

// 또는 구현을 대체
vi.spyOn(api, 'fetchUser').mockResolvedValue({ name: '테스트' });

// getter/setter 감시
vi.spyOn(api, 'baseUrl', 'get').mockReturnValue('http://test.com');
```

주의: `vi.spyOn`은 Browser Mode에서는 모듈 export에 대해 동작하지 않을 수 있다.

---

## 모듈 모킹

### vi.mock() — 모듈 전체를 대체

`vi.mock()` 호출은 자동으로 파일 최상단으로 호이스팅되므로, import보다 먼저 실행된다.

```ts
import { vi } from 'vitest';
import { fetchUser } from './api';

// 이 코드는 import보다 먼저 실행됨
vi.mock(import('./api'), () => ({
  fetchUser: vi.fn().mockResolvedValue({ name: '모킹된 유저' }),
}));

it('모킹된 API를 사용한다', async () => {
  const user = await fetchUser('123');
  expect(user.name).toBe('모킹된 유저');
});
```

### 원래 구현의 일부만 대체하기

```ts
vi.mock(import('./api'), async (importOriginal) => {
  // 원래 모듈의 모든 export를 가져옴
  const mod = await importOriginal();
  return {
    ...mod,
    // 이것만 모킹으로 대체
    fetchUser: vi.fn().mockResolvedValue({ name: '모킹' }),
  };
});
```

### 리액트 컴포넌트 모듈 모킹

자식 컴포넌트를 모킹하여 부모 컴포넌트를 격리 테스트할 수 있다.

```tsx
vi.mock(import('./components/HeavyChart'), () => ({
  default: vi.fn(() => <div data-testid="mocked-chart">Chart</div>),
}));
```

### 클래스 모킹 (Vitest 4 신기능)

Vitest 4부터 `vi.fn()`에 클래스를 직접 전달할 수 있다.

```ts
vi.mock(import('./services/UserService'), () => {
  const UserService = vi.fn(
    class {
      // 인스턴스 메서드를 모킹
      getUser = vi.fn().mockResolvedValue({ name: '모킹' });
      updateUser = vi.fn();
    },
  );
  return { UserService };
});
```

### 주의사항

같은 파일 내에서 정의된 함수 간의 내부 호출은 모킹할 수 없다. 모듈 모킹은 외부에서 해당 모듈의 export에 접근하는 경우에만 적용된다.

```ts
// foobar.js
export function foo() {
  return 'original';
}
export function foobar() {
  return foo();
} // 이 내부 호출은 모킹 불가

// foobar.test.js
vi.mock(import('./foobar'), async (importOriginal) => ({
  ...(await importOriginal()),
  foo: vi.fn().mockReturnValue('mocked'),
}));

// foobar()를 호출하면 내부의 foo()는 여전히 원래 구현을 사용
```

---

## 타이머 모킹

디바운스, 쓰로틀, setTimeout, setInterval 등을 사용하는 컴포넌트를 테스트할 때 사용한다.

### 기본 사용법

```ts
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()  // 가짜 타이머 활성화
})

afterEach(() => {
  vi.useRealTimers()  // 실제 타이머로 복원
})

it('3초 후 알림이 사라진다', async () => {
  render(<Notification message="저장됨" />)

  expect(screen.getByText('저장됨')).toBeInTheDocument()

  // 3초를 앞으로 빠르게 진행
  vi.advanceTimersByTime(3000)

  expect(screen.queryByText('저장됨')).not.toBeInTheDocument()
})
```

### 디바운스된 검색 입력 테스트

```ts
it('입력이 멈춘 후 300ms 뒤에 검색이 실행된다', async () => {
  const onSearch = vi.fn()
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  render(<SearchInput onSearch={onSearch} debounceMs={300} />)

  await user.type(screen.getByRole('searchbox'), '리액트')

  // 300ms 전에는 검색이 실행되지 않음
  expect(onSearch).not.toHaveBeenCalled()

  // 300ms 진행
  vi.advanceTimersByTime(300)

  expect(onSearch).toHaveBeenCalledWith('리액트')
})
```

### 날짜/시간 모킹

`vi.setSystemTime()`으로 현재 시각을 고정할 수 있다. `vi.useFakeTimers()`를 먼저 호출해야 한다.

```ts
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2025, 0, 1, 12, 0, 0))  // 2025년 1월 1일 정오
})

afterEach(() => {
  vi.useRealTimers()
})

it('현재 날짜를 올바르게 포맷한다', () => {
  render(<DateDisplay />)

  expect(screen.getByText('2025년 1월 1일')).toBeInTheDocument()
})
```

---

## 네트워크 요청 모킹

Vitest 공식 문서는 네트워크 요청 모킹에 **MSW(Mock Service Worker)**를 권장한다. MSW는 프레임워크에 무관하게 동작하며, 실제 HTTP 요청을 인터셉트하는 방식이다.

### jsdom 환경에서 MSW 사용

```ts
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node'; // Node.js 환경용
import { http, HttpResponse } from 'msw';

// 핸들러 정의
const handlers = [
  http.get('/api/posts', () => {
    return HttpResponse.json([
      { id: 1, title: '첫 번째 포스트', body: '내용...' },
    ]);
  }),
  http.post('/api/posts', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 2, ...body }, { status: 201 });
  }),
];

// 서버 설정
const server = setupServer(...handlers);

beforeAll(() => server.listen()); // 테스트 시작 전 서버 시작
afterEach(() => server.resetHandlers()); // 매 테스트 후 핸들러 초기화
afterAll(() => server.close()); // 모든 테스트 후 서버 종료
```

### Browser Mode에서 MSW 사용

Browser Mode에서는 `msw/browser`의 `setupWorker`를 대신 사용한다.

```ts
import { setupWorker } from 'msw/browser'  // 브라우저 환경용
import { http, HttpResponse } from 'msw'

const worker = setupWorker(
  http.get('/api/posts', () => {
    return HttpResponse.json([...])
  })
)

beforeAll(() => worker.start())
afterEach(() => worker.resetHandlers())
afterAll(() => worker.stop())
```

### 특정 테스트에서 핸들러 오버라이드

```ts
it('서버 에러 시 에러 화면을 보여준다', async () => {
  // 이 테스트에서만 에러 응답을 반환
  server.use(
    http.get('/api/posts', () => {
      return new HttpResponse(null, { status: 500 })
    })
  )

  render(<PostList />)

  await screen.findByText('서버 에러가 발생했습니다')
})
```

---

## 전역 객체 모킹

jsdom이나 happy-dom에 없는 브라우저 API를 모킹할 때 `vi.stubGlobal()`을 사용한다.

```ts
// IntersectionObserver 모킹
vi.stubGlobal(
  'IntersectionObserver',
  vi.fn(
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  ),
);

// matchMedia 모킹
vi.stubGlobal(
  'matchMedia',
  vi.fn((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
);

// ResizeObserver 모킹
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

config에서 `unstubGlobals: true`를 설정하면 매 테스트 후 자동으로 원래 값으로 복원된다.

---

## 환경 변수 모킹

`import.meta.env`에 직접 값을 할당하거나 `vi.stubEnv()`를 사용한다.

```ts
import { beforeEach, expect, it, vi } from 'vitest'

it('환경 변수에 따라 다른 URL을 사용한다', () => {
  // vi.stubEnv는 unstubEnvs 옵션이 켜져 있으면 자동 복원됨
  vi.stubEnv('VITE_API_URL', 'http://test-api.example.com')

  render(<ApiStatus />)

  expect(screen.getByText('http://test-api.example.com')).toBeInTheDocument()
})
```

---

## Vitest 4 변경사항

Vitest 4에서 모킹 관련으로 변경된 주요 사항은 다음과 같다.

`vi.fn().getMockName()`의 기본 반환값이 `'spy'`에서 `'vi.fn()'`으로 변경되었다. 스냅샷에서 `[MockFunction spy]`가 `[MockFunction]`으로 바뀐다. `vi.spyOn`으로 만든 스파이는 원래 이름을 유지한다.

`vi.restoreAllMocks()`가 더 이상 자동 모킹된(automocked) 함수에 영향을 주지 않으며, `vi.spyOn`으로 수동 생성한 스파이만 복원한다. `.mockRestore()`는 여전히 구현을 리셋하고 상태를 초기화한다.

`vi.fn()`에 클래스를 직접 전달할 수 있게 되었다. 이전에는 함수와 프로토타입 상속을 직접 조작해야 했다.

`new` 키워드로 호출된 모킹 함수는 `mock.apply` 대신 인스턴스를 생성(construct)한다. 따라서 `mockImplementation`에 화살표 함수를 전달하면 `is not a constructor` 에러가 발생한다. `function` 키워드나 `class` 문법을 사용해야 한다.

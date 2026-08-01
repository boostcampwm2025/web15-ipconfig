# React 컴포넌트 테스트 패턴

> `@testing-library/react` + `jsdom` 환경 (`*.test.tsx` 파일)

## 목차

1. [기본 렌더링 테스트](#기본-렌더링-테스트)
2. [사용자 인터랙션 테스트](#사용자-인터랙션-테스트)
3. [비동기 상태 테스트](#비동기-상태-테스트)
4. [폼 테스트](#폼-테스트)
5. [조건부 렌더링 테스트](#조건부-렌더링-테스트)
6. [Context/Provider가 필요한 컴포넌트](#contextprovider가-필요한-컴포넌트)
7. [커스텀 훅 테스트](#커스텀-훅-테스트)
8. [접근성 테스트](#접근성-테스트)

---

## 기본 렌더링 테스트

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Greeting } from './Greeting';

describe('Greeting', () => {
  it('사용자 이름을 렌더링한다', () => {
    render(<Greeting name="홍길동" />);
    expect(screen.getByText('안녕하세요, 홍길동!')).toBeInTheDocument();
  });

  it('이름이 없으면 기본 인사말을 보여준다', () => {
    render(<Greeting />);
    expect(screen.getByText('안녕하세요!')).toBeInTheDocument();
  });
});
```

---

## 사용자 인터랙션 테스트

`userEvent.setup()`으로 인스턴스를 만들어 사용하는 것이 권장 방식이다.
실제 브라우저 이벤트 흐름을 시뮬레이션하므로 `fireEvent`보다 신뢰도가 높다.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { Counter } from './Counter';

it('버튼 클릭으로 카운트가 증가한다', async () => {
  const user = userEvent.setup();
  render(<Counter initialCount={0} />);

  await user.click(screen.getByRole('button', { name: /증가/i }));

  expect(screen.getByText('카운트: 1')).toBeInTheDocument();
});
```

---

## 비동기 상태 테스트

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { expect, it } from 'vitest';
import { UserProfile } from './UserProfile';

it('로딩 후 사용자 정보를 표시한다', async () => {
  render(<UserProfile userId="123" />);

  // 로딩 상태 확인
  expect(screen.getByText('로딩 중...')).toBeInTheDocument();

  // findByText: 기본 1000ms 타임아웃으로 요소가 나타날 때까지 대기
  await screen.findByText('홍길동');
});

it('에러 발생 시 에러 메시지를 표시한다', async () => {
  render(<UserProfile userId="invalid" />);

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('사용자를 찾을 수 없습니다');
  });
});
```

쿼리 선택 기준:
- **`getBy*`** — 요소가 반드시 있어야 하는 경우 (없으면 즉시 실패)
- **`queryBy*`** — 요소가 없을 수도 있는 경우 (없으면 null 반환)
- **`findBy*`** — 비동기로 나타나는 요소를 기다릴 때

---

## 폼 테스트

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { LoginForm } from './LoginForm';

it('유효한 입력으로 폼을 제출한다', async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn();
  render(<LoginForm onSubmit={handleSubmit} />);

  await user.type(screen.getByLabelText(/이메일/i), 'test@example.com');
  await user.type(screen.getByLabelText(/비밀번호/i), 'password123');
  await user.click(screen.getByRole('button', { name: /로그인/i }));

  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});

it('이메일이 비어있으면 에러 메시지를 표시한다', async () => {
  const user = userEvent.setup();
  render(<LoginForm onSubmit={vi.fn()} />);

  await user.click(screen.getByRole('button', { name: /로그인/i }));

  expect(screen.getByText('이메일을 입력해주세요')).toBeInTheDocument();
});
```

---

## 조건부 렌더링 테스트

`rerender`로 같은 컴포넌트를 다른 props로 다시 렌더링할 수 있다.

```tsx
it('관리자에게만 삭제 버튼을 보여준다', () => {
  const { rerender } = render(<UserActions role="viewer" />);

  expect(screen.queryByRole('button', { name: /삭제/i })).not.toBeInTheDocument();

  rerender(<UserActions role="admin" />);

  expect(screen.getByRole('button', { name: /삭제/i })).toBeInTheDocument();
});
```

---

## Context/Provider가 필요한 컴포넌트

자주 쓰이는 Provider를 감싸는 커스텀 render 함수를 `src/test/` 아래에 두면
테스트 파일마다 반복 작성을 피할 수 있다.

```tsx
// src/test/renderWithProviders.tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/common/contexts/ThemeProvider';

export function renderWithProviders(ui: React.ReactElement, options = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }
  return render(ui, { wrapper: Wrapper, ...options });
}
```

```tsx
// 사용 예
import { renderWithProviders } from '@/test/renderWithProviders';

it('다크 모드에서 올바르게 렌더링된다', () => {
  renderWithProviders(<Header />);
  expect(screen.getByRole('banner')).toBeInTheDocument();
});
```

---

## 커스텀 훅 테스트

`renderHook`으로 컴포넌트 없이 훅만 독립적으로 테스트할 수 있다.

```tsx
import { renderHook, act } from '@testing-library/react';
import { expect, it } from 'vitest';
import { useCounter } from './useCounter';

it('초기값을 반환한다', () => {
  const { result } = renderHook(() => useCounter(0));
  expect(result.current.count).toBe(0);
});

it('increment를 호출하면 카운트가 증가한다', () => {
  const { result } = renderHook(() => useCounter(0));

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

Context가 필요한 훅은 `wrapper` 옵션으로 Provider를 감싼다:

```tsx
const { result } = renderHook(() => useTheme(), {
  wrapper: ThemeProvider,
});
```

---

## 접근성 테스트

### 키보드 내비게이션

```tsx
it('Tab 키로 포커스가 순서대로 이동한다', async () => {
  const user = userEvent.setup();
  render(<Navigation />);

  await user.tab();
  expect(screen.getByRole('link', { name: /홈/i })).toHaveFocus();

  await user.tab();
  expect(screen.getByRole('link', { name: /소개/i })).toHaveFocus();
});
```

### ARIA 속성 검증

```tsx
it('모달이 올바른 ARIA 속성을 가진다', () => {
  render(<Modal isOpen={true} title="확인" />);

  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveAttribute('aria-modal', 'true');
  expect(dialog).toHaveAttribute('aria-labelledby');
});
```

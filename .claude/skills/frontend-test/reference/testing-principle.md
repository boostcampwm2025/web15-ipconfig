---
name: react-vitest-testing
description: >
  React 컴포넌트 및 훅에 대한 단위 테스트 작성 가이드. Vitest + React Testing Library 기반.
  Roy Osherove의 "단위 테스트의 기술(The Art of Unit Testing)" 3판 원칙을 React 생태계에 적용한 베스트 프랙티스 스킬.
  사용자가 React 컴포넌트 테스트, Vitest 테스트, 훅 테스트, 테스트 전략, 테스트 리팩토링,
  테스트 코드 리뷰, TDD, mocking 전략 등을 언급하면 이 스킬을 참조할 것.
  "테스트 작성해줘", "이 컴포넌트에 테스트 추가해줘", "테스트 개선해줘" 같은 요청에도 반드시 사용할 것.
---

# React + Vitest 테스트 작성 원칙

## 철학: 좋은 테스트의 세 기둥

모든 테스트 작성 시 아래 세 기둥을 기준으로 판단한다.
테스트가 아무리 많아도, 신뢰·유지보수·가독성이 없으면 가치가 없다.

1. **신뢰성(Trustworthy)** — 실행하면 결과를 믿을 수 있는가? 테스트 자체에 버그가 없고, 올바른 것을 검증하는가?
2. **유지보수성(Maintainable)** — 프로덕션 코드가 바뀔 때 테스트도 쉽게 따라갈 수 있는가? 사소한 변경에 깨지지 않는가?
3. **가독성(Readable)** — 테스트를 처음 보는 개발자가 의도를 즉시 파악할 수 있는가? 실패 시 원인을 빠르게 찾을 수 있는가?

> 가독성이 무너지면 나머지 두 기둥도 함께 무너진다.

## 핵심 모델: Entry Point → Exit Point

테스트의 본질은 **진입점(Entry Point)에서 시작해 종료점(Exit Point)을 검증**하는 것이다.

Exit Point는 세 가지 유형이 있다:

| Exit Point 유형 | 일반 코드 예시                  | React 컴포넌트 대응       |
| --------------- | ------------------------------- | ------------------------- |
| **반환 값**     | 함수가 값을 반환                | props → 렌더링 출력 (DOM) |
| **상태 변화**   | 호출 전후 관찰 가능한 상태 변경 | 인터랙션 → UI 변화        |
| **의존성 호출** | 제3자 함수/서비스 호출          | 콜백 호출, API 요청       |

**원칙**: Exit Point당 최소 하나의 독립된 테스트를 작성한다. 하나의 테스트에서 여러 Exit Point를 검증하지 않는다.

**Mock 비율 가이드**: 테스트의 대부분(~95%)은 반환 값 또는 상태 변화 기반으로 유지한다. Mock 객체를 사용한 의존성 호출 검증은 전체의 ~5% 이하로 최소화한다. Mock이 많아지면 유지보수성이 급격히 떨어진다.

## 테스트 작성 규칙

### 1. Arrange-Act-Assert (AAA) 패턴을 항상 따른다

```tsx
test('장바구니에 상품 추가 시 수량이 증가한다', async () => {
  // Arrange — 테스트 환경 준비
  const user = userEvent.setup();
  render(<Cart initialItems={[]} />);

  // Act — 사용자 행동 수행
  await user.click(screen.getByRole('button', { name: /추가/i }));

  // Assert — 기대 결과 검증
  expect(screen.getByText('1개')).toBeInTheDocument();
});
```

세 단계가 명확히 구분되어야 가독성이 보장된다. 빈 줄로 구분하는 것을 권장한다.

### 2. 구현이 아닌 동작을 테스트한다

```tsx
// ❌ 나쁜 예: 구현 세부사항 테스트 (내부 상태를 직접 확인)
expect(component.state.count).toBe(1);

// ✅ 좋은 예: 사용자가 관찰할 수 있는 결과 테스트
expect(screen.getByRole('heading')).toHaveTextContent('1');
```

### 3. 접근성 기반 쿼리를 우선한다

쿼리 우선순위(React Testing Library 공식 가이드):
1순위: `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`
2순위: `getByDisplayValue`, `getByAltText`, `getByTitle`
3순위(최후 수단): `getByTestId`

### 4. 테스트 이름은 USE 컨벤션을 따른다

Osherove의 USE(Unit of work, Scenario, Expected result) 네이밍:

```
[작업 단위]_[시나리오]_[기대 결과]
```

React에서는 describe/it 구조로 자연스럽게 표현:

```tsx
describe('LoginForm', () => {
  it('유효한 이메일과 비밀번호 입력 시 onSubmit이 호출된다', ...)
  it('이메일이 비어있으면 에러 메시지를 표시한다', ...)
  it('제출 중에는 버튼이 비활성화된다', ...)
})
```

### 5. 테스트에 로직을 넣지 않는다

```tsx
// ❌ 나쁜 예: 테스트 안에 조건문/반복문
if (items.length > 0) {
  expect(screen.getByText(items[0].name)).toBeInTheDocument();
}

// ✅ 좋은 예: 직접적이고 단순한 assert
expect(screen.getByText('사과')).toBeInTheDocument();
```

테스트 안에 if, for, switch, try-catch가 있으면 테스트 자체에 버그가 숨을 수 있다. 이는 신뢰성을 깨뜨린다.

### 6. 외부 의존성은 반드시 격리한다

API 호출, 타이머, 라우터, 전역 상태 등은 mock으로 격리한다:

```tsx
// API mock 예시
vi.mock('../api/fetchUser', () => ({
  fetchUser: vi.fn().mockResolvedValue({ name: '홍길동', age: 30 }),
}));
```

단, 격리의 목적은 "해당 컴포넌트의 로직만 검증"하기 위함이다. 격리할 필요 없는 순수 유틸 함수까지 mock하지 않는다.

## 컴포넌트 유형별 테스트 전략

| 컴포넌트 유형          | 주요 Entry Point | 주요 Exit Point            | 핵심 전략                        |
| ---------------------- | ---------------- | -------------------------- | -------------------------------- |
| 순수 UI 컴포넌트       | props            | 렌더링 출력                | 다양한 props 조합, 조건부 렌더링 |
| 폼 컴포넌트            | 사용자 입력      | onSubmit 콜백, 유효성 에러 | userEvent로 실제 입력 시뮬레이션 |
| 비동기 데이터 컴포넌트 | 마운트/트리거    | 로딩→데이터→에러 상태      | API mock + waitFor/findBy        |
| 커스텀 훅              | 훅 호출/인자     | 반환 값, 상태 변화         | renderHook 사용                  |

자세한 코드 패턴은 `reference/component-testing.md`를 참조한다.

## 안티패턴 체크리스트

테스트 작성 후 아래 항목을 점검한다:

1. 테스트에 조건문/반복문이 있는가? → 제거하고 단순화
2. 하나의 테스트에서 여러 Exit Point를 검증하는가? → 분리
3. 내부 상태(state, ref)를 직접 확인하는가? → 사용자 관찰 가능한 출력으로 변경
4. snapshot 테스트에 과도하게 의존하는가? → 핵심 동작 테스트로 대체
5. mock이 전체 테스트의 5%를 크게 초과하는가? → 설계 재검토
6. 테스트 이름만으로 무엇을 검증하는지 알 수 없는가? → USE 네이밍 적용
7. 프로덕션 코드 변경 없이 테스트가 자주 깨지는가? → 구현 결합도 낮추기

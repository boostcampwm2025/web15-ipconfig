# Vitest 스냅샷 테스트 가이드

> 출처: Vitest v4.x 공식 문서 (https://vitest.dev/guide/snapshot)

## 목차

1. [스냅샷 테스트란](#스냅샷-테스트란)
2. [기본 스냅샷 (toMatchSnapshot)](#기본-스냅샷)
3. [인라인 스냅샷 (toMatchInlineSnapshot)](#인라인-스냅샷)
4. [파일 스냅샷 (toMatchFileSnapshot)](#파일-스냅샷)
5. [리액트 컴포넌트 스냅샷 패턴](#리액트-컴포넌트-스냅샷-패턴)
6. [스냅샷 업데이트](#스냅샷-업데이트)
7. [Jest와의 차이점](#jest와의-차이점)
8. [스냅샷을 쓸 때와 쓰지 말아야 할 때](#스냅샷을-쓸-때와-쓰지-말아야-할-때)

---

## 스냅샷 테스트란

스냅샷 테스트는 함수나 컴포넌트의 출력이 예기치 않게 변경되지 않았는지 확인하는 방법이다. 처음 실행 시 기준 스냅샷 파일을 생성하고, 이후 실행 시 현재 출력과 저장된 스냅샷을 비교한다. 두 값이 다르면 테스트가 실패하며, 변경이 의도된 것이라면 스냅샷을 업데이트하면 된다.

스냅샷 파일은 코드 변경과 함께 커밋해야 하며, 코드 리뷰 과정에서 함께 검토되어야 한다.

---

## 기본 스냅샷

`toMatchSnapshot()`을 호출하면 `.snap` 파일에 스냅샷이 저장된다. 파일은 테스트 파일 옆에 `__snapshots__` 디렉토리 안에 생성된다.

```ts
import { expect, it } from 'vitest';

it('객체 구조를 스냅샷으로 검증한다', () => {
  const user = getUser('123');

  // 첫 실행: __snapshots__/user.test.ts.snap 파일을 생성
  // 이후 실행: 저장된 스냅샷과 비교
  expect(user).toMatchSnapshot();
});
```

생성되는 `.snap` 파일의 형태는 다음과 같다.

```
// Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports['객체 구조를 스냅샷으로 검증한다 1'] = `
{
  "id": "123",
  "name": "홍길동",
  "email": "hong@example.com",
}
`
```

---

## 인라인 스냅샷

`toMatchInlineSnapshot()`은 별도 파일 대신 테스트 코드 안에 직접 스냅샷을 저장한다. 첫 실행 시 Vitest가 테스트 파일을 직접 수정하여 스냅샷 문자열을 삽입한다.

```ts
it('날짜를 한국어 형식으로 포맷한다', () => {
  const result = formatDate(new Date(2025, 0, 15));

  // 첫 실행 시 Vitest가 자동으로 아래 빈 괄호 안에 값을 삽입함
  expect(result).toMatchInlineSnapshot(`"2025년 1월 15일"`);
});
```

인라인 스냅샷의 장점은 별도 파일로 이동하지 않고도 기대값을 바로 확인할 수 있다는 것이다. 작은 단위의 유틸리티 함수 테스트에 적합하다.

---

## 파일 스냅샷

`toMatchFileSnapshot()`은 스냅샷을 지정한 파일 경로에 저장한다. 확장자를 자유롭게 지정할 수 있어서, HTML이나 JSON 같은 형태의 출력을 더 읽기 쉬운 형태로 저장할 수 있다.

```ts
it('HTML을 올바르게 렌더링한다', async () => {
  const html = renderToString(<Card title="테스트" />)

  await expect(html).toMatchFileSnapshot('./test/snapshots/card.output.html')
})
```

---

## 리액트 컴포넌트 스냅샷 패턴

### 기본 컴포넌트 스냅샷

```tsx
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Button } from './Button';

it('기본 버튼이 올바르게 렌더링된다', () => {
  const { container } = render(<Button>클릭</Button>);

  expect(container.firstChild).toMatchSnapshot();
});

it('비활성화된 버튼이 올바르게 렌더링된다', () => {
  const { container } = render(<Button disabled>클릭</Button>);

  expect(container.firstChild).toMatchSnapshot();
});
```

### 인라인 스냅샷으로 작은 컴포넌트 테스트

```tsx
it('Badge 컴포넌트 렌더링', () => {
  const { container } = render(<Badge count={5} />);

  expect(container.innerHTML).toMatchInlineSnapshot(
    `"<span class="badge">5</span>"`,
  );
});
```

### 스냅샷 직렬화 커스터마이징

Vitest는 `pretty-format`으로 스냅샷을 직렬화한다. 커스텀 시리얼라이저를 추가하면 특정 객체의 스냅샷 형태를 제어할 수 있다.

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    snapshotFormat: {
      // Jest에서 마이그레이션한 경우, Jest의 기본 동작을 유지하려면
      printBasicPrototype: true, // Vitest 기본값은 false
    },
    // Vue 컴포넌트용 시리얼라이저 (Vue에서 마이그레이션한 경우)
    snapshotSerializers: ['jest-serializer-vue'],
  },
});
```

---

## 스냅샷 업데이트

스냅샷이 의도적으로 변경된 경우, 업데이트가 필요하다.

CLI에서 `--update` 또는 `-u` 플래그를 사용하면 모든 실패한 스냅샷이 현재 값으로 업데이트된다.

```bash
vitest --update
vitest -u
```

Watch 모드에서 실행 중이라면 터미널에서 `u` 키를 누르면 된다.

Vitest 4부터 `--update` 옵션이 더 세분화되었다. `"new"` (새 스냅샷만), `"all"` (모두 업데이트), `"none"` (업데이트 안 함) 같은 값을 전달할 수 있다.

---

## Jest와의 차이점

Vitest의 스냅샷은 Jest와 호환되지만 몇 가지 차이가 있다.

첫째, 스냅샷 파일 헤더가 다르다. Jest는 `// Jest Snapshot v1`을, Vitest는 `// Vitest Snapshot v1`을 사용한다. 기능에는 영향 없지만 마이그레이션 시 커밋 diff에 나타날 수 있다.

둘째, `printBasicPrototype`의 기본값이 다르다. Jest는 `true`이고 Vitest는 `false`여서, Vitest의 스냅샷이 더 깔끔하다. Jest에서는 `Array [`, `Object {`가 표시되지만, Vitest에서는 `[`, `{`만 표시된다.

셋째, 커스텀 메시지 전달 시 구분자가 다르다. Jest는 콜론(`:`)을 사용하고, Vitest는 가독성을 위해 꺾쇠(`>`)를 사용한다.

---

## 스냅샷을 쓸 때와 쓰지 말아야 할 때

### 적합한 경우

스냅샷은 렌더링 출력의 회귀를 감지하는 데 유용하다. 특히 디자인 시스템의 공통 컴포넌트처럼 렌더링 결과가 안정적이고, 의도치 않은 변경을 빠르게 감지해야 할 때 효과적이다. 직렬화 가능한 데이터 구조(API 응답 형태, 설정 객체 등)의 검증에도 적합하다.

### 피해야 하는 경우

스냅샷이 너무 크면 가독성이 떨어지고 코드 리뷰에서 무시되기 쉽다. 자주 변경되는 컴포넌트의 전체 렌더링 결과를 스냅샷으로 저장하면 유지보수 부담이 커진다. 이런 경우에는 스냅샷 대신 특정 요소나 속성만 선별적으로 assertion하는 것이 더 낫다.

```tsx
// ❌ 비추천: 전체 렌더링 결과를 스냅샷
expect(container).toMatchSnapshot(); // 변경이 잦으면 불편

// ✅ 추천: 핵심 동작만 검증
expect(screen.getByRole('heading')).toHaveTextContent('환영합니다');
expect(screen.getByRole('button')).toBeDisabled();
```

### 비동기 concurrent 테스트에서의 주의사항

concurrent 테스트에서 스냅샷을 사용할 때는 로컬 Test Context의 `expect`를 사용해야 올바른 테스트가 감지된다.

```ts
it.concurrent('concurrent 환경의 스냅샷', async ({ expect }) => {
  const result = await fetchData();
  expect(result).toMatchSnapshot();
});
```

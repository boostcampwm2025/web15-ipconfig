import {
  createContext as createReactContext,
  useContext as useReactContext,
} from 'react';

/**
 * Context 생성 옵션을 정의하는 인터페이스
 * @template T - Context에 저장될 값의 타입
 */
export interface createContextOptions<T> {
  /** Context의 이름 (디버깅 목적) */
  contextName?: string;
  /** Context의 기본값 */
  defaultValue?: T;
  /** 생성될 Hook의 이름 (에러 메시지에 사용) */
  hookName?: string;
  /** Provider 컴포넌트의 이름 (에러 메시지에 사용) */
  providerName?: string;
  /** 커스텀 에러 메시지 */
  errorMessage?: string;
}

const getUseContextErrorMessage = (
  hookName?: string,
  providerName?: string,
  errorMessage?: string,
) => {
  return (
    errorMessage ??
    `${hookName}가 undefined를 반환했습니다. ${providerName}으로 컴포넌트를 감쌌는지 확인해주세요.`
  );
};

export function createContext<T>(options: createContextOptions<T> = {}) {
  const {
    contextName,
    defaultValue,
    hookName = 'useContext',
    providerName = 'Context.Provider',
    errorMessage,
  } = options;

  const Context = createReactContext<T | undefined>(defaultValue);

  Context.displayName = contextName;

  function useContext() {
    const value = useReactContext(Context);
    if (!value) {
      const error = new Error(
        getUseContextErrorMessage(hookName, providerName, errorMessage),
      );

      error.name = 'ContextError';

      throw error;
    }

    return value;
  }

  return [Context.Provider, useContext, Context] as const;
}

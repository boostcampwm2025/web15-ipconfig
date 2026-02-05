import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = sessionStorage.getItem('ui-theme') as Theme;
      if (savedTheme) return savedTheme;

      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    // 테마 변경 시 transition 비활성화
    root.classList.add('disable-transitions');

    // 기존 테마 클래스 제거 및 새 테마 추가
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // 강제로 스타일 계산을 발생시켜 DOM 업데이트 보장
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    window.getComputedStyle(root).opacity;

    sessionStorage.setItem('ui-theme', theme);

    // transition 다시 활성화 (비동기적으로 처리하여 렌더링 이후에 적용)
    setTimeout(() => {
      root.classList.remove('disable-transitions');
    }, 0);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

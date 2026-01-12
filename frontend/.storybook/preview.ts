import type { Preview } from '@storybook/react-vite';
import React from 'react';
import '@/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    (Story) => {
      // Storybook에서 dark 모드 자동 적용
      React.useEffect(() => {
        document.documentElement.classList.add('dark');
        return () => {
          document.documentElement.classList.remove('dark');
        };
      }, []);

      return React.createElement(Story);
    },
  ],
};

export default preview;

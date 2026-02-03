import { useCallback, useEffect } from 'react';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import { updatePrimitiveFieldAction } from '@/common/api/yjs/actions/widgetContent';
import type { DockerfileData } from '../types/wizard';

const DEFAULT_VALUES = {
  'Node.js': {
    version: '22',
    port: 3000,
    packageManager: 'npm',
    command: 'npm run dev',
  },
} as const;

export function useDockerfileWizard() {
  const { widgetId, type } = useWidgetIdAndType();
  const content = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content as unknown as DockerfileData | undefined,
    ),
  );

  const framework = content?.framework;

  // 초기값 설정
  useEffect(() => {
    if (content && !content.framework) {
      updatePrimitiveFieldAction(widgetId, type, 'framework', 'Node.js');
      updatePrimitiveFieldAction(
        widgetId,
        type,
        'version',
        DEFAULT_VALUES['Node.js'].version,
      );
      updatePrimitiveFieldAction(
        widgetId,
        type,
        'port',
        DEFAULT_VALUES['Node.js'].port,
      );
      updatePrimitiveFieldAction(
        widgetId,
        type,
        'packageManager',
        DEFAULT_VALUES['Node.js'].packageManager,
      );
      updatePrimitiveFieldAction(
        widgetId,
        type,
        'command',
        DEFAULT_VALUES['Node.js'].command,
      );
    }
  }, [content, widgetId, type]);

  const updateField = useCallback(
    (fieldKey: keyof DockerfileData, value: string | number | boolean) => {
      updatePrimitiveFieldAction(widgetId, type, fieldKey as string, value);
    },
    [widgetId, type],
  );

  const setFramework = useCallback(
    (newFramework: DockerfileData['framework'] | null) => {
      // 같은 프레임워크 클릭 시 초기화 방지
      if (!newFramework || framework === newFramework) return;

      updateField('framework', newFramework);

      // 프레임워크별 기본값 설정
      const defaults = DEFAULT_VALUES[newFramework];
      if (defaults) {
        Object.entries(defaults).forEach(([key, value]) => {
          updateField(key as keyof DockerfileData, value);
        });
      }
    },
    [framework, updateField],
  );

  return { content, framework, updateField, setFramework };
}

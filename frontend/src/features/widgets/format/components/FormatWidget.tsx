import { useState, useEffect } from 'react';
import * as prettier from 'prettier/standalone';
import prettierPluginBabel from 'prettier/plugins/babel';
import prettierPluginEstree from 'prettier/plugins/estree';
import { RotateCcw } from 'lucide-react';
import type { ActiveTip, PrettierConfig } from '../types/format';
import {
  SAMPLE_CODE,
  CONFIG_OPTIONS,
  DEFAULT_CONFIG,
} from '../constants/format';
import { Button } from '@/common/components/shadcn/button';
import { GuidelineBox } from '@/common/components/guidelineBox/GuidelineBox';
import WidgetFrame from '@/common/components/widgetFrame/WidgetFrame';
import { LuPalette } from 'react-icons/lu';
import ToggleItem from './ToggleItem';
import ConfigSelectItem from './ConfigSelectItem';
import { WidgetPreview } from '@/common/components/widgetFrame/WidgetPreview';
import { useFormatWidget } from '../hooks/useFormatWidget';

function FormatWidget() {
  const { widgetId, config, updateConfig, resetConfig } = useFormatWidget();

  const [formattedCode, setFormattedCode] = useState(SAMPLE_CODE);
  const [activeTip, setActiveTip] = useState<ActiveTip | null>(null);

  useEffect(() => {
    const formatCode = async () => {
      try {
        const formatted = await prettier.format(SAMPLE_CODE, {
          parser: 'babel',
          plugins: [prettierPluginBabel, prettierPluginEstree],
          ...config,
          trailingComma: config.trailingComma as 'none' | 'es5' | 'all',
          arrowParens: config.arrowParens as 'avoid' | 'always',
        });
        setFormattedCode(formatted.trim());
      } catch {
        setFormattedCode(SAMPLE_CODE);
      }
    };
    formatCode();
  }, [config]);

  const handleToggle = (key: keyof PrettierConfig) => {
    updateConfig(key, !config[key]);
  };

  const handleChange = (
    key: keyof PrettierConfig,
    value: string | number | boolean,
  ) => {
    updateConfig(key, value);
  };

  const handleReset = () => {
    resetConfig(DEFAULT_CONFIG);
  };

  const handleHover = (
    label: string,
    description: string,
    recommendation?: string,
  ) => {
    setActiveTip({ label, description, recommendation });
  };

  return (
    <WidgetFrame
      title="코드 포맷"
      icon={<LuPalette className="text-pink-500" />}
      actions={[
        <div className="flex" key={`${widgetId}-reset`}>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
          >
            <RotateCcw size={14} />
            초기화
          </Button>
        </div>,
      ]}
    >
      <div className="relative flex w-[550px] flex-col gap-4 p-4">
        {/* Settings Grid */}
        <div className="grid w-[500px] grid-cols-2 gap-4 gap-x-8">
          {CONFIG_OPTIONS.map((option) =>
            option.type === 'toggle' ? (
              <ToggleItem
                key={option.key}
                label={option.label}
                checked={config[option.key] as boolean}
                options={option.options}
                onChange={() => handleToggle(option.key)}
                onHover={() =>
                  handleHover(
                    option.label,
                    option.description,
                    option?.recommendation,
                  )
                }
              />
            ) : (
              <ConfigSelectItem
                key={option.key}
                label={option.label}
                value={String(config[option.key])}
                options={option.options!}
                onChange={(v) => handleChange(option.key, v)}
                onHover={() =>
                  handleHover(
                    option.label,
                    option.description,
                    option?.recommendation,
                  )
                }
              />
            ),
          )}
        </div>

        {/* Guideline Box */}
        <div className="w-full">
          {activeTip ? (
            <GuidelineBox
              category={activeTip.label.split(' (')[0]}
              description={activeTip.description}
              recommendation={activeTip.recommendation}
            />
          ) : (
            <GuidelineBox
              category="Prettier 설정"
              description="각 옵션 위에 마우스를 올리면 상세 설명을 볼 수 있습니다."
              recommendation="팀의 코드 스타일 가이드에 맞춰 설정하세요."
            />
          )}
        </div>

        <WidgetPreview code={formattedCode} />
      </div>
    </WidgetFrame>
  );
}

export default FormatWidget;

import { Label } from '@/common/components/shadcn/label';
import { Input } from '@/common/components/shadcn/input';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/common/components/shadcn/radio-group';
import type { DockerfileData } from '../../types/wizard';

interface NodeOptionsProps {
  content: DockerfileData;
  onChange: (
    field: keyof DockerfileData,
    value: string | number | boolean,
  ) => void;
}

export function NodeOptions({ content, onChange }: NodeOptionsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>Node.js 버전</Label>
        <Input
          value={content.version || ''}
          onChange={(e) => onChange('version', e.target.value)}
          placeholder="20"
        />
      </div>

      <div className="space-y-2">
        <Label>포트</Label>
        <Input
          type="number"
          value={content.port || ''}
          onChange={(e) => onChange('port', Number(e.target.value))}
          placeholder="3000"
        />
      </div>

      <div className="space-y-2">
        <Label>패키지 매니저</Label>
        <RadioGroup
          value={content.packageManager}
          onValueChange={(val) => {
            onChange('packageManager', val);
            if (content.command) {
              const parts = content.command.split(' ');
              if (['npm', 'yarn', 'pnpm', 'bun'].includes(parts[0])) {
                parts[0] = val;
                onChange('command', parts.join(' '));
              }
            }
          }}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="npm" id="npm" />
            <Label htmlFor="npm">npm</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yarn" id="yarn" />
            <Label htmlFor="yarn">yarn</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pnpm" id="pnpm" />
            <Label htmlFor="pnpm">pnpm</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bun" id="bun" />
            <Label htmlFor="bun">bun</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>실행 스크립트 (CMD)</Label>
        <Input
          value={content.command || ''}
          onChange={(e) => onChange('command', e.target.value)}
          onBlur={(e) => {
            if (!e.target.value.trim()) {
              onChange('command', 'npm run dev');
            }
          }}
          placeholder="npm run dev"
        />
      </div>
    </>
  );
}

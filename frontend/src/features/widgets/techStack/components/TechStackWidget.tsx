import type { WidgetData } from '@/common/types/widgetData';
import WidgetContainer from '@/common/components/widget/WidgetContainer';
import WidgetHeader from '@/common/components/widget/WidgetHeader';
import { LuLayers, LuPlus } from 'react-icons/lu';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/common/components/shadcn/select';
import { useState } from 'react';
import { Button } from '@/common/components/shadcn/button';
import { SUBJECT_GROUPS } from '@/common/mocks/techStacks';

function TechStackWidget({ id, position, width, height }: WidgetData) {
  const [value, setValue] = useState<{ value: string; label: string }>({
    value: 'nest.js',
    label: 'Nest.js',
  });

  return (
    <WidgetContainer
      id={id}
      position={position}
      type="tech"
      content="Tech Stack"
      width={width}
      height={height}
    >
      <WidgetHeader
        title="기술 스택"
        icon={<LuLayers className="text-primary" size={18} />}
      />
      <section className="flex flex-col gap-4">
        <Select>
          <div className="flex items-center gap-2 font-bold">
            <div className="shrink-0">주제 :</div>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="논의할 주제를 선택해주세요." />
            </SelectTrigger>
          </div>

          <SelectContent>
            {SUBJECT_GROUPS.map((group) => (
              <SelectGroup key={group.category}>
                <SelectLabel>{group.category}</SelectLabel>
                {group.subjects.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        <main className="grid grid-cols-4 gap-3">
          <button className="hover:border-primary flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-gray-700 text-sm font-semibold transition-colors hover:bg-gray-700/70">
            <LuPlus size={20} />
            <span>추가하기</span>
          </button>
        </main>
        <footer className="flex items-center justify-end gap-2 font-bold">
          <Button variant="secondary">취소</Button>
          <Button>확정</Button>
        </footer>
      </section>
    </WidgetContainer>
  );
}

export default TechStackWidget;

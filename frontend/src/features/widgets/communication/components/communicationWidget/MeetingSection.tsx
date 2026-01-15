import type { CommunicationData } from '@/features/widgets/communication/types/communication';
import { cn } from '@/common/lib/utils';
import { LuCheck } from 'react-icons/lu';

interface MeetingSectionProps {
  data: CommunicationData['meeting'];
  onChange: (key: keyof CommunicationData['meeting'], value: string) => void;
}

const FEEDBACK_STYLES = ['Soft', 'Honest', 'Retrospective'] as const;

const FEEDBACK_STYLE_LABELS: Record<(typeof FEEDBACK_STYLES)[number], string> =
  {
    Soft: '부드럽게',
    Honest: '솔직하게',
    Retrospective: '회고 중심',
  };

const DAYS = ['None', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/shadcn/select';

export function MeetingSection({ data, onChange }: MeetingSectionProps) {
  return (
    <div className="space-y-4">
      {/* No Meeting Day */}
      <div className="space-y-2">
        <h3 className="text-secondary-foreground text-sm font-semibold">
          미팅 없는 날
        </h3>
        <div className="rounded-lg border p-3">
          <Select
            value={data.noMeetingDay}
            onValueChange={(value) => onChange('noMeetingDay', value)}
          >
            <SelectTrigger className="h-9 w-full text-xs font-medium">
              <SelectValue placeholder="선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((day) => (
                <SelectItem key={day} value={day} className="text-xs">
                  {day === 'None' ? '없음' : day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Feedback Style */}
      <div className="space-y-2">
        <h3 className="text-secondary-foreground text-sm font-semibold">
          피드백 방식
        </h3>
        <div className="grid grid-cols-3 gap-3 rounded-lg border p-3">
          {FEEDBACK_STYLES.map((style) => {
            const isSelected = data.feedbackStyle === style;
            return (
              <button
                key={style}
                onClick={() => {
                  onChange('feedbackStyle', style);
                }}
                className={cn(
                  'relative flex h-14 flex-col items-center justify-center gap-1 rounded-lg border transition-all duration-200',
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary ring-primary/20 shadow-sm ring-1'
                    : 'border-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/50',
                )}
              >
                {isSelected && (
                  <div className="bg-primary text-primary-foreground absolute top-1.5 right-1.5 rounded-full p-0.5">
                    <LuCheck size={8} />
                  </div>
                )}
                <span className="text-xs font-bold">
                  {FEEDBACK_STYLE_LABELS[style]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// import WidgetContainer from '@/common/components/widgetFrame/WidgetContainer';
// import WidgetHeader from '@/common/components/widgetFrame/WidgetHeader';
import { useState } from 'react';
import type { CommunicationData } from '../../types/communication';
import { DEFAULT_COMMUNICATION_DATA } from '../../constants/communication';
import { CommunicationSection } from './CommunicationSection';
import { SlaStepper } from './SlaStepper';
import { TimeSection } from './TimeSection';
import { MeetingSection } from './MeetingSection';
import WidgetFrame from '@/common/components/widgetFrame/WidgetFrame';
import { LuMessageSquare } from 'react-icons/lu';

function CommunicationWidget() {
  const [data, setData] = useState<CommunicationData>(
    DEFAULT_COMMUNICATION_DATA,
  );

  return (
    <WidgetFrame
      title="커뮤니케이션"
      icon={<LuMessageSquare className="text-yellow-500" />}
      defaultLayout={{ x: 2000, y: 1000 }}
    >
      <div className="flex w-[550px] flex-col gap-6 p-4">
        <CommunicationSection
          data={data.communication}
          onChange={(key, value) =>
            setData((prev) => ({
              ...prev,
              communication: { ...prev.communication, [key]: value },
            }))
          }
        />

        <div className="bg-border h-px w-full" />

        <div className="grid grid-cols-2 gap-4">
          <SlaStepper
            responseTime={data.sla.responseTime}
            onChange={(value) =>
              setData((prev) => ({
                ...prev,
                sla: { responseTime: value },
              }))
            }
          />
          <TimeSection
            data={data.timeManagement}
            onChange={(key, value) =>
              setData((prev) => ({
                ...prev,
                timeManagement: { ...prev.timeManagement, [key]: value },
              }))
            }
          />
        </div>

        <div className="bg-border h-px w-full" />

        <MeetingSection
          data={data.meeting}
          onChange={(key, value) =>
            setData((prev) => ({
              ...prev,
              meeting: { ...prev.meeting, [key]: value },
            }))
          }
        />
      </div>
    </WidgetFrame>
  );
}

export default CommunicationWidget;

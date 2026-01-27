import { useCommunication } from '../../hooks/useCommunication';
import { CommunicationSection } from './CommunicationSection';
import { SlaStepper } from './SlaStepper';
import { TimeSection } from './TimeSection';
import { MeetingSection } from './MeetingSection';
import WidgetFrame from '@/common/components/widgetFrame/WidgetFrame';
import { LuMessageSquare } from 'react-icons/lu';

function CommunicationWidget() {
  const {
    communication,
    sla,
    timeManagement,
    meeting,
    actions: {
      updateCommunicationChannel,
      updateSla,
      updateTimeManagement,
      updateMeeting,
    },
  } = useCommunication();

  return (
    <WidgetFrame
      title="커뮤니케이션"
      icon={<LuMessageSquare className="text-yellow-500" />}
      defaultLayout={{ x: 2000, y: 1000 }}
    >
      <div className="flex w-[550px] flex-col gap-6 p-4">
        <CommunicationSection
          data={communication}
          onChange={updateCommunicationChannel}
        />

        <div className="bg-border h-px w-full" />

        <div className="grid grid-cols-2 gap-4">
          <SlaStepper responseTime={sla.responseTime} onChange={updateSla} />
          <TimeSection data={timeManagement} onChange={updateTimeManagement} />
        </div>

        <div className="bg-border h-px w-full" />

        <MeetingSection data={meeting} onChange={updateMeeting} />
      </div>
    </WidgetFrame>
  );
}

export default CommunicationWidget;

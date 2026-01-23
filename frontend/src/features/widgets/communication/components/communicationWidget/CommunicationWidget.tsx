import { CommunicationSection } from './CommunicationSection';
import { SlaStepper } from './SlaStepper';
import { TimeSection } from './TimeSection';
import { MeetingSection } from './MeetingSection';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useCommunicationYjs } from '@/features/widgets/communication/hooks/useCommunicationYjs';
import type { CommunicationData } from '../../types/communication';

function CommunicationWidget() {
  const { widgetId } = useWidgetIdAndType();
  const { communication, sla, timeManagement, meeting, actions } =
    useCommunicationYjs({ widgetId });

  return (
    <div className="flex w-[550px] flex-col gap-6 p-4">
      <CommunicationSection
        data={communication}
        onChange={(key, value) =>
          actions.updateCommunication(
            key as keyof CommunicationData['communication'],
            value,
          )
        }
      />

      <div className="bg-border h-px w-full" />

      <div className="grid grid-cols-2 gap-4">
        <SlaStepper
          responseTime={sla.responseTime}
          onChange={(value) => actions.updateSla('responseTime', value)}
        />
        <TimeSection
          data={timeManagement}
          onChange={(key, value) =>
            actions.updateTimeManagement(
              key as keyof CommunicationData['timeManagement'],
              value,
            )
          }
        />
      </div>

      <div className="bg-border h-px w-full" />

      <MeetingSection
        data={meeting}
        onChange={(key, value) =>
          actions.updateMeeting(
            key as keyof CommunicationData['meeting'],
            value,
          )
        }
      />
    </div>
  );
}

export default CommunicationWidget;

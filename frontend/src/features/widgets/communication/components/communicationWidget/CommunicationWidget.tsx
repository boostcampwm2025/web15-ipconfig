import type { CommunicationData } from '../../types/communication';
import { DEFAULT_COMMUNICATION_DATA } from '../../constants/communication';
import { CommunicationSection } from './CommunicationSection';
import { SlaStepper } from './SlaStepper';
import { TimeSection } from './TimeSection';
import { MeetingSection } from './MeetingSection';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import { emitUpdateWidget } from '@/common/api/socket';
import { useCommunication } from '../../hooks/useCommunication';

function CommunicationWidget() {
  const { widgetId } = useWidgetIdAndType();
  const content = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content,
    ),
  ) as CommunicationData | undefined;

  const communicationData = content ?? DEFAULT_COMMUNICATION_DATA;

  const { communication, sla, timeManagement, meeting, actions } =
    useCommunication({
      data: communicationData,
      onDataChange: (nextData) => {
        emitUpdateWidget(widgetId, nextData);
      },
    });

  return (
    <>
      <div className="flex w-[550px] flex-col gap-6 p-4">
        <CommunicationSection
          data={communication}
          onChange={(key, value) =>
            actions.updateCommunication({ [key]: value })
          }
        />

        <div className="bg-border h-px w-full" />

        <div className="grid grid-cols-2 gap-4">
          <SlaStepper
            responseTime={sla.responseTime}
            onChange={(value) => actions.updateSLA({ responseTime: value })}
          />
          <TimeSection
            data={timeManagement}
            onChange={(key, value) =>
              actions.updateTimeManagement({ [key]: value })
            }
          />
        </div>

        <div className="bg-border h-px w-full" />

        <MeetingSection
          data={meeting}
          onChange={(key, value) => actions.updateMeeting({ [key]: value })}
        />
      </div>
    </>
  );
}

export default CommunicationWidget;

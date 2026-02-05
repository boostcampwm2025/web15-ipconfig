import { useEffect, useState } from 'react';
import Joyride, { type CallBackProps, STATUS } from 'react-joyride';
import { TOOL_BAR_STEPS } from './constant/ToolBarSteps';
import { HEADER_STEPS } from './constant/HeaderSteps';
import { FINISH_STEPS } from './constant/FinishSteps';

const TOUR_STORAGE_KEY = 'has-visited-workspace';

const WorkspaceTour = () => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!hasVisited) {
      setTimeout(() => {
        setRun(true);
      }, 1000);
    }
  }, []);

  const ALL_STEPS = [...TOOL_BAR_STEPS, ...HEADER_STEPS, ...FINISH_STEPS];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data as {
      status: typeof STATUS.FINISHED | typeof STATUS.SKIPPED;
    };

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    }
  };

  return (
    <Joyride
      steps={ALL_STEPS}
      run={run}
      continuous
      showSkipButton
      showProgress
      disableCloseOnEsc
      hideCloseButton
      callback={handleJoyrideCallback}
      disableScrolling={true}
      disableScrollParentFix={true}
      floaterProps={{
        styles: {
          floater: {
            position: 'absolute',
            top: 0,
            left: 0,
          },
        },
      }}
      styles={{
        options: {
          arrowColor: '#EEEEEE',
          backgroundColor: '#EEEEEE',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          primaryColor: '#00ADB5',
          textColor: '#222831',
          zIndex: 1000,
        },
      }}
      locale={{
        back: '이전',
        close: '닫기',
        last: '완료',
        nextLabelWithProgress: '다음 ({step} / {steps})',
        skip: '건너뛰기',
      }}
    />
  );
};

export default WorkspaceTour;

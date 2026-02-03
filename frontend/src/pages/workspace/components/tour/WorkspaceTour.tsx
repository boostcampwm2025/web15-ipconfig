import { useEffect, useMemo, useState } from 'react';
import Joyride, { type CallBackProps, STATUS, type Step } from 'react-joyride';

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

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data as {
      status: typeof STATUS.FINISHED | typeof STATUS.SKIPPED;
    };

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    }
  };

  const steps: Step[] = useMemo(
    () => [
      {
        target: '#tool-bar',
        content:
          '이 툴바에서 원하는 위젯을 선택하여 캔버스에 생성할 수 있습니다.',
        placement: 'top',
        disableBeacon: true,
      },
      {
        target: '#export-group-dropdown-button',
        content:
          '작업이 완료되면 여기서 문서나 설정 파일로 내보낼 수 있습니다.',
        placement: 'bottom',
      },
      {
        target: '#invite-button',
        content: '동료를 초대하거나 주소를 복사하여 함께 작업해보세요!',
        placement: 'bottom',
      },
    ],
    [],
  );

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#3b82f6',
          textColor: '#333',
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

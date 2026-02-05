import { type Step } from 'react-joyride';

export const FINISH_STEPS: Step[] = [
  {
    target: '#zoom-controls',
    content:
      '버튼을 눌러 캔버스를 확대하거나 축소할 수 있습니다. 또한 Win: Ctrl + 마우스 휠 / Mac: Cmd + 마우스 휠을 사용하여 캔버스를 확대하거나 축소할 수 있습니다.',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#canvas-wrapper',
    content:
      "마지막으로, '/' 키를 눌러 커서 챗을 사용할 수 있습니다. 자유롭게 회의해보세요!",
    spotlightClicks: true,
  },
];

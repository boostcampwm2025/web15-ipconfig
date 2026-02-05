import { type Step } from 'react-joyride';

export const HEADER_STEPS: Step[] = [
  {
    target: '#user-list-card',
    content: '현재 작업하고 있는 팀원을 확인할 수 있습니다.',
    placement: 'bottom',
    spotlightClicks: true,
  },
  {
    target: '#export-group-dropdown-button',
    content: '작업이 완료되면 여기서 문서나 설정 파일로 내보낼 수 있습니다.',
    placement: 'bottom',
    spotlightClicks: true,
  },
  {
    target: '#invite-button',
    content: '동료를 초대하거나 주소를 복사하여 함께 작업할 수 있습니다.',
    placement: 'bottom',
    spotlightClicks: true,
  },
];

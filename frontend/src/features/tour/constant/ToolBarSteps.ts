import { type Step } from 'react-joyride';

export const TOOL_BAR_STEPS: Step[] = [
  {
    target: '#tool-bar',
    content: '이 툴바에서 원하는 위젯을 선택하여 캔버스에 생성할 수 있습니다.',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#tech-stack-button',
    content: '기술 스택을 보고 선택할 수 있는 기술 스택 위젯을 생성합니다.',
    placement: 'top',
  },
  {
    target: '#git-convention-button',
    content:
      '깃 전략, 브랜치 이름, 커밋 메시지 규칙 등을 정할 수 있는 깃 컨벤션 위젯을 생성합니다.',
    placement: 'top',
  },
  {
    target: '#collaboration-button',
    content:
      '코드 리뷰 규칙, PR 규칙 등을 정할 수 있는 작업 및 협업 위젯을 생성합니다.',
    placement: 'top',
  },
  {
    target: '#communication-button',
    content:
      '소통 방식, 피드백 방식 등을 정할 수 있는 커뮤니케이션 위젯을 생성합니다.',
    placement: 'top',
  },
  {
    target: '#naming-convention-button',
    content:
      '각 분야 별 네이밍 규칙을 정할 수 있는 네이밍 컨벤션 위젯을 생성합니다.',
    placement: 'top',
  },
  {
    target: '#code-format-button',
    content:
      'Prettier 등의 코드 포매팅 규칙을 설정할 수 있는 코드 포매팅 위젯을 생성합니다.',
    placement: 'top',
  },
  {
    target: '#dockerfile-button',
    content: 'Dockerfile을 설정할 수 있는 Dockerfile 위젯을 생성합니다.',
    placement: 'top',
  },
];

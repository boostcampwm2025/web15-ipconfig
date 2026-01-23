import type { ConfigOption, PrettierConfig } from '../types/format';

// 모든 설정을 보여줄 수 있는 샘플 코드 (printWidth 차이를 보여주는 다양한 길이의 줄 포함)
export const SAMPLE_CODE = `const Button = ({ label, onClick, disabled }) => {
  const styles = { color: "blue", padding: 10, margin: 5, display: "flex" };
  const validate = x => x.length > 0 && typeof x === "string" && x !== "undefined";
  const getClassName = (active, size) => active ? "btn-" + size + "-primary" : "btn-" + size + "-disabled";
  return <button style={styles} onClick={onClick} disabled={disabled} data-label={label}>{label}</button>;
};`;

export const CONFIG_OPTIONS: ConfigOption[] = [
  {
    key: 'printWidth',
    label: '줄 길이 (Print Width)',
    description:
      '줄바꿈 기준 길이입니다. 짧으면 가독성 향상과 작은 화면에 유리하지만, 긴 함수명/변수명 사용 시 불편할 수 있습니다. 길면 더 많은 코드를 한 화면에 표시하지만, 가독성이 저하될 수 있습니다.',
    recommendation:
      '80은 전통적 표준으로 가독성 우선, 100-120은 현대적 모니터에 적합한 균형잡힌 선택입니다.',
    type: 'select',
    options: [
      {
        label: '80',
        value: 80,
        description:
          '전통적 표준. 작은 화면과 코드 리뷰에 적합. 가독성 우선. 긴 이름 사용 시 불편할 수 있음.',
      },
      {
        label: '100',
        value: 100,
        description: '현대적 모니터에 적합. 균형잡힌 선택. 널리 사용됨.',
      },
      {
        label: '120',
        value: 120,
        description:
          '넓은 화면에서 더 많은 코드 표시. 긴 함수명/변수명에 유리. 가독성 저하 가능.',
      },
      {
        label: '150',
        value: 150,
        description:
          '매우 넓은 화면용. 많은 코드 표시 가능. 가독성 저하 위험 높음.',
      },
    ],
  },
  {
    key: 'useTabs',
    label: '탭 사용 (Tabs)',
    description:
      '탭은 사용자별 너비 조절 가능하고 접근성에 유리하지만, 환경마다 다르게 표시될 수 있습니다. 스페이스는 모든 환경에서 동일하게 표시되지만, 너비 조절이 불가능합니다.',
    recommendation:
      'JS/TS 생태계는 스페이스가 일반적이며, Go/PHP 등은 탭이 표준입니다. 팀 컨벤션을 따르세요.',
    type: 'toggle',
    options: [
      { label: '탭', value: true },
      { label: '스페이스', value: false },
    ],
  },
  {
    key: 'tabWidth',
    label: '들여쓰기 폭 (Tab Width)',
    description:
      '2칸은 더 많은 코드를 화면에 표시하지만 중첩이 깊어지면 구분이 어려울 수 있습니다. 4칸은 중첩 구조가 명확히 구분되지만 화면 공간을 더 많이 사용합니다.',
    recommendation:
      'JS/TS/React는 2칸, Java/C#/Python은 4칸이 관례입니다. 기존 프로젝트 스타일에 맞추세요.',
    type: 'select',
    options: [
      {
        label: '2',
        value: 2,
        description:
          'JS/TS/React 표준. 더 많은 코드 표시 가능. 중첩이 깊어지면 구분 어려움.',
      },
      {
        label: '4',
        value: 4,
        description:
          'Java/C#/Python 표준. 중첩 구조 명확. 화면 공간 더 많이 사용.',
      },
    ],
  },
  {
    key: 'semi',
    label: '세미콜론 (Semicolons)',
    description:
      '사용 시 명시적이고 안전하지만 코드가 길어질 수 있습니다. 생략 시 코드가 간결하지만 ASI(자동 세미콜론 삽입)에 의존합니다. Prettier가 ASI 문제를 처리하므로 둘 다 안전합니다.',
    type: 'toggle',
    options: [
      { label: '사용', value: true },
      { label: '생략', value: false },
    ],
  },
  {
    key: 'singleQuote',
    label: '홑따옴표 (Single Quote)',
    description:
      '홑따옴표는 Shift 없이 입력 가능하고 간결하지만, 쌍따옴표는 JSON과 일관성이 있고 HTML 속성과 통일됩니다. 문자열 내 따옴표가 많으면 Prettier가 자동으로 반대 따옴표로 전환합니다.',
    recommendation:
      'JSON과 일관성이 있지만, 홑따옴표도 널리 사용됩니다. 팀에서 통일하는 것이 중요합니다.',
    type: 'toggle',
    options: [
      { label: '홑따옴표', value: true },
      { label: '쌍따옴표', value: false },
    ],
  },
  {
    key: 'jsxSingleQuote',
    label: 'JSX 홑따옴표 (JSX Quote)',
    description:
      '홑따옴표는 JS와 통일성을 제공하지만, 쌍따옴표는 HTML 관례와 일치합니다. 일반 문자열 옵션(singleQuote)과 독립적으로 설정됩니다.',
    recommendation:
      'HTML 관례와 일치하지만, JS와 통일성을 위해 홑따옴표를 사용하는 팀도 있습니다.',
    type: 'toggle',
    options: [
      { label: '홑따옴표', value: true },
      { label: '쌍따옴표', value: false },
    ],
  },
  {
    key: 'trailingComma',
    label: '후행 쉼표 (Trailing Comma)',
    description:
      '후행 쉼표는 Git diff를 깔끔하게 만들고 요소 추가/이동을 쉽게 하지만, 구형 환경에서는 지원이 제한적일 수 있습니다. none은 전통적 스타일이지만 diff가 덜 깔끔합니다.',
    recommendation:
      'all은 diff가 가장 깔끔하고, es5는 구형 환경 호환, none은 전통적 스타일입니다.',
    type: 'select',
    options: [
      {
        label: 'None',
        value: 'none',
        description:
          '후행 쉼표 사용 안 함. 전통적 스타일. Git diff 덜 깔끔. 요소 추가 시 더 많은 라인 변경.',
      },
      {
        label: 'ES5',
        value: 'es5',
        description:
          '객체와 배열에만 사용. 구형 환경 호환. 함수 파라미터에는 사용 안 함. diff 개선 효과 제한적.',
      },
      {
        label: 'All',
        value: 'all',
        description:
          '모든 곳에 사용 (ES2017+ 필요). Git diff 가장 깔끔. 최신 환경 필요.',
      },
    ],
  },
  {
    key: 'bracketSpacing',
    label: '중괄호 공백 (Bracket Spacing)',
    description:
      '공백 사용 시 객체 내용이 더 잘 구분되어 가독성이 향상되지만, 공백 없음은 코드가 더 컴팩트해집니다. 선호도에 따라 다를 수 있습니다.',
    recommendation:
      '가독성 향상에 도움이 되지만, 선호도에 따라 다를 수 있습니다.',
    type: 'toggle',
    options: [
      { label: '공백 사용', value: true },
      { label: '공백 없음', value: false },
    ],
  },
  {
    key: 'arrowParens',
    label: '화살표 괄호 (Arrow Parens)',
    description:
      'avoid는 시각적으로 간결하지만 타입/기본값 추가 시 수정이 필요합니다. always는 리팩터링에 안정적이지만 코드가 약간 길어집니다. 단일 파라미터 화살표 함수에만 영향을 줍니다.',
    recommendation:
      'TypeScript 사용 시 always가 리팩터링에 안정적입니다. 공식 문서는 always를 권장합니다.',
    type: 'select',
    options: [
      {
        label: 'avoid',
        value: 'avoid',
        description:
          '가능하면 괄호 생략. 시각적으로 간결. 타입/기본값 추가 시 수정 필요.',
      },
      {
        label: 'always',
        value: 'always',
        description:
          '항상 괄호 사용. 리팩터링 안정적. TypeScript 사용 시 권장. 코드 약간 길어짐.',
      },
    ],
  },
  {
    key: 'singleAttributePerLine',
    label: '속성 줄바꿈 (Attr Per Line)',
    description:
      '줄바꿈 시 속성별 diff가 명확해지고 가독성이 향상되지만, 짧은 요소는 더 컴팩트하게 표시됩니다. 한 줄 배치는 공간 효율적이지만 속성이 많으면 가독성이 떨어질 수 있습니다.',
    recommendation:
      '속성 개수가 많은 프로젝트에서는 줄바꿈을 선호하기도 합니다.',
    type: 'toggle',
    options: [
      { label: '줄바꿈', value: true },
      { label: '한 줄에 배치', value: false },
    ],
  },
];

export const DEFAULT_CONFIG: PrettierConfig = {
  printWidth: 80,
  useTabs: false,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  singleAttributePerLine: false,
};

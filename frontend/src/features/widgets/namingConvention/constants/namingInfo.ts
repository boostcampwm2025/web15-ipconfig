export const NAMING_INFO = {
  frontend: {
    variable:
      '데이터를 담는 변수는 주로 camelCase를 사용합니다. boolean 타입은 is, has 등을 접두어로 붙입니다.',
    function:
      '함수는 동작을 나타내므로 동사로 시작하는 camelCase를 권장합니다. (예: handleSubmit)',
    component:
      'React 컴포넌트는 PascalCase를 사용해야 합니다. 파일명과 컴포넌트명을 일치시키는 것이 좋습니다.',
    constant:
      '변하지 않는 상수는 UPPER_SNAKE_CASE를 사용합니다. (예: MAX_COUNT)',
  },
  backend: {
    variable:
      '지역 변수나 멤버 변수는 언어 특성에 따라 camelCase 또는 snake_case를 사용합니다.',
    function:
      '메서드나 함수 이름은 동사로 시작하며 명확한 의도를 드러내야 합니다.',
    class: '클래스명은 명사여야 하며 PascalCase를 사용하는 것이 일반적입니다.',
    constant: '환경 변수나 전역 상수는 대문자와 언더스코어를 사용합니다.',
  },
};

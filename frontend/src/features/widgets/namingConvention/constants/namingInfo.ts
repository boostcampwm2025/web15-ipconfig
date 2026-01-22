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
  database: {
    table:
      '테이블명은 복수형 명사를 사용하며 snake_case를 권장합니다. (예: user_profiles)',
    column:
      '컬럼명은 snake_case를 사용하며 명확하고 간결하게 작성합니다. (예: created_at)',
    index:
      '인덱스명은 idx_ 접두어를 붙이고 snake_case를 사용합니다. (예: idx_user_email)',
    constraint:
      '제약조건명은 의미있는 이름을 사용하며 snake_case를 권장합니다. (예: fk_user_profile_id)',
  },
  common: {
    utility:
      '유틸리티 함수는 동사로 시작하는 camelCase를 사용합니다. (예: formatDate, validateEmail)',
    constant:
      '공통 상수는 UPPER_SNAKE_CASE를 사용하며 모듈별로 그룹화합니다. (예: API_BASE_URL)',
    type: '타입 정의는 PascalCase를 사용하며 명사로 작성합니다. (예: UserProfile, ApiResponse)',
    enum: '열거형은 PascalCase를 사용하며 단수형 명사로 작성합니다. (예: UserRole, OrderStatus)',
  },
};

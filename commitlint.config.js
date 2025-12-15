module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 커스텀 규칙
    'type-enum': [
      2, // Error 레벨입니다. (규칙을 어기면 커밋을 막고 에러를 띄움. 1은 경고, 0은 무시)
      'always', // 이 규칙을 항상 적용한다는 뜻입니다.
      [
        'feat', // 새로운 기능 추가
        'fix', // 버그 수정
        'docs', // 문서 변경
        'style', // 스타일 관련 변경
        'refactor', // 리팩토링 (기능 변경이 없는)
        'test', // 테스트 코드 추가/변경
        'chore', // dependency, 스크립트, config, CI 관련, 그 외 변경사항
      ],
    ],
    'subject-max-length': [2, 'always', 50],
    'subject-case': [0], // 대소문자 제한 비활성화 (ESLint 같은 고유명사 허용)
  },
};

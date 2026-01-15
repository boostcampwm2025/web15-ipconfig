import type { SelectInputOption } from '@/common/types/selectInput';

export const SUBJECT_GROUPS: SelectInputOption[] = [
  {
    category: '공통 및 기반',
    options: [
      '언어',
      '패키지 매니저',
      '모노레포 관리 도구',
      '코드 퀄리티 (린팅)',
    ],
  },
  {
    category: '프론트엔드',
    options: ['프레임워크', '스타일링', '상태 관리', 'UI 라이브러리'],
  },
  {
    category: '백엔드',
    options: ['프레임워크', 'API 아키텍처', '문서화'],
  },
  {
    category: '데이터베이스 및 스토리지',
    options: [
      '메인 DB',
      'ORM 및 쿼리 빌더',
      '서버 로깅',
      '캐싱/메시지 큐',
      '파일 스토리지',
    ],
  },
  {
    category: '인프라 및 데브옵스',
    options: ['배포 환경', 'CI/CD', '모니터링/로깅'],
  },
];

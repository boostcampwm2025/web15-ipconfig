export type SubjectGuidelines = Record<string, Record<string, string>>;

export const SUBJECT_GUIDELINES: SubjectGuidelines = {
  '공통 및 기반': {
    언어: '팀에게 익숙하거나 도전해보고 싶은 언어를 선택해보세요. TypeScript, JavaScript, Go, Java 등 후보를 비교해보세요.',
    '패키지 매니저':
      '캐시와 모노레포 지원을 기준으로 패키지 매니저를 선택해보세요. 모든 플랫폼에서 pnpm, npm, yarn berry를 비교해보세요.',
    '모노레포 관리 도구':
      '프로젝트 규모와 배포 속도에 맞춰 모노레포 구성을 선택해보세요. Turborepo, Nx, 단일 레포 등 옵션을 검토해보세요.',
    '코드 퀄리티 (린팅)':
      'ESLint/Prettier와 Husky/Git Hooks를 조합해 공동 스타일과 린트를 자동화해보는 방안을 고민해보세요.',
  },
  프론트엔드: {
    프레임워크:
      '웹, 모바일, 데스크톱 등 대상 환경에 맞는 프레임워크를 선택해보세요. Next.js, React Native, Flutter, Vue, Svelte 등을 고려해보세요.',
    스타일링:
      'Tailwind CSS, Emotion, styled-components, CSS 중 팀 선호도와 타입 안전성을 기준으로 전략을 세워보세요.',
    '상태 관리':
      '서버 상태에는 TanStack Query를, 클라이언트 전역 상태에는 Zustand/Recoil/Redux를 각각 실험해보세요.',
    'UI 라이브러리':
      '이미 다양한 UI 라이브러리가 있습니다. Radix UI, Headless UI, Shadcn/ui 등을 활용해 재사용 가능한 UI를 구성하는 방향을 잡아보세요.',
  },
  백엔드: {
    프레임워크:
      '아키텍처 요구와 팀 경험을 바탕으로 Nest.js, Express, Fastify, Spring Boot를 비교해보세요.',
    'API 아키텍처':
      'REST, GraphQL, gRPC 등 데이터 흐름과 소비자 특성에 맞는 아키텍처를 선택해보세요. 요청량과 클라이언트 타입을 고려하세요.',
    '인증/인가':
      'JWT, OAuth 2.0, NextAuth.js, Passport.js 등을 검토해서 인증 흐름을 설계해보세요.',
    문서화:
      'Swagger(OpenAPI), Postman Collection 등을 통해 API 계약을 명확히 유지해보세요.',
  },
  '데이터베이스 및 스토리지': {
    '메인 DB':
      '트랜잭션/스키마 니즈에 따라 PostgreSQL, MySQL, MongoDB를 비교해서 주 DB를 결정해보세요. 분석/로그 데이터용 별도 저장소도 고민해보세요.',
    'ORM 및 쿼리 빌더':
      'Prisma, TypeORM, Drizzle ORM 등 생산성과 타입 안정성을 고려해 신중히 선택해보세요.',
    '캐싱/메시지 큐':
      'Redis, RabbitMQ 등을 활용해 비동기 처리와 성능 향상 전략을 실험해보세요.',
    '파일 스토리지':
      '정적/미디어 자산 관리를 어떻게 할지 고민해보세요. AWS S3, Cloudinary 같은 옵션을 검토해보세요.',
  },
  '인프라 및 데브옵스': {
    '배포 환경':
      'Vercel, AWS(EC2/Lambda), Docker + Nginx 등 배포 전략을 직접 비교해보세요.',
    'CI/CD':
      'GitHub Actions, Jenkins, CircleCI 등 반복 가능한 파이프라인을 설정해서 자동화 흐름을 점검해보세요.',
    '모니터링/로깅':
      'Sentry, Datadog, Winston 등을 활용해 서비스 상태 추적 체계를 구축해보세요. 알림과 롤백 전략도 함께 정의해보세요.',
  },
};

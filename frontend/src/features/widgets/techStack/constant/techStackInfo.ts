import type {
  FrontendTechStack,
  BackendTechStack,
  DatabaseTechStack,
  InfrastructureTechStack,
  CommonTechStack,
  TechStack,
} from '../types/techStack';

export const FRONTEND_TECH_STACKS: FrontendTechStack[] = [
  // Framework & Library
  // https://www.statista.com/statistics/1124699/worldwide-developer-survey-most-used-frameworks-web/
  // https://twentytwentyone.tistory.com/1459
  { id: 'react', category: 'framework', name: 'React' },
  { id: 'vue', category: 'framework', name: 'Vue.js' },
  { id: 'nextjs', category: 'framework', name: 'Next.js' },
  { id: 'svelte', category: 'framework', name: 'Svelte' },
  { id: 'sveltekit', category: 'framework', name: 'SvelteKit' },
  { id: 'solid', category: 'framework', name: 'Solid' },
  { id: 'astro', category: 'framework', name: 'Astro' },
  { id: 'angular', category: 'framework', name: 'Angular' },
  { id: 'qwik', category: 'framework', name: 'Qwik' },
  { id: 'remix', category: 'framework', name: 'Remix' },
  // Mobile로 빼야하나? 삭제?
  { id: 'reactnative', category: 'framework', name: 'React Native' },
  { id: 'flutter', category: 'framework', name: 'Flutter' },

  // State Management
  // https://trio.dev/7-top-react-state-management-libraries/
  { id: 'redux', category: 'stateManagement', name: 'Redux' },
  { id: 'recoil', category: 'stateManagement', name: 'Recoil' },
  { id: 'zustand', category: 'stateManagement', name: 'Zustand' },
  { id: 'jotai', category: 'stateManagement', name: 'Jotai' },
  { id: 'mobx', category: 'stateManagement', name: 'Mobx' },
  { id: 'xstate', category: 'stateManagement', name: 'XState' },
  { id: 'valtio', category: 'stateManagement', name: 'Valtio' },
  { id: 'tanstackquery', category: 'stateManagement', name: 'TanStack Query' },

  // Styling
  { id: 'tailwindcss', category: 'styling', name: 'Tailwind CSS' },
  { id: 'styledcomponents', category: 'styling', name: 'styled-components' },
  { id: 'emotion', category: 'styling', name: 'Emotion' },
  { id: 'sass/scss', category: 'styling', name: 'Sass/SCSS' },
  { id: 'vanillaextract', category: 'styling', name: 'Vanilla Extract' },

  // UI Library
  { id: 'mui', category: 'uiLibrary', name: 'MUI' },
  { id: 'chakraui', category: 'uiLibrary', name: 'Chakra UI' },
  { id: 'antdesign', category: 'uiLibrary', name: 'Ant Design' },
  { id: 'shadcn/ui', category: 'uiLibrary', name: 'Shadcn/ui' },
  { id: 'headlessui', category: 'uiLibrary', name: 'Headless UI' },
];

export const BACKEND_TECH_STACKS: BackendTechStack[] = [
  // Framework
  { id: 'nestjs', category: 'framework', name: 'NestJS' },
  { id: 'expressjs', category: 'framework', name: 'Express.js' },
  { id: 'fastify', category: 'framework', name: 'Fastify' },
  { id: 'springboot', category: 'framework', name: 'Spring Boot' },
  { id: 'django', category: 'framework', name: 'Django' },
  { id: 'fastapi', category: 'framework', name: 'FastAPI' },
  { id: 'flask', category: 'framework', name: 'Flask' },
  { id: 'laravel', category: 'framework', name: 'Laravel' },
  { id: 'rubyonrails', category: 'framework', name: 'Ruby on Rails' },
  { id: 'gin', category: 'framework', name: 'Gin' },
  { id: 'aspnetcore', category: 'framework', name: 'ASP.NET Core' },
  { id: 'hono', category: 'framework', name: 'Hono' }, // 최신 트렌드 추가

  // API Architecture (New)
  { id: 'graphql', category: 'apiArchitecture', name: 'GraphQL' },
  { id: 'apollo', category: 'apiArchitecture', name: 'Apollo Server' },
  { id: 'trpc', category: 'apiArchitecture', name: 'tRPC' },
  { id: 'grpc', category: 'apiArchitecture', name: 'gRPC' },
  { id: 'socketio', category: 'apiArchitecture', name: 'Socket.io' },

  // Documentation (New)
  { id: 'swagger', category: 'documentation', name: 'Swagger' },
  { id: 'postman', category: 'documentation', name: 'Postman' }, // 문서화 도구로 분류
];

export const DATABASE_TECH_STACKS: DatabaseTechStack[] = [
  // Main Database
  // https://survey.stackoverflow.co/2025/technology#most-popular-technologies-language-write-ins
  { id: 'mysql', category: 'mainDatabase', name: 'MySQL' },
  { id: 'postgresql', category: 'mainDatabase', name: 'PostgreSQL' },
  { id: 'sqlite', category: 'mainDatabase', name: 'SQLite' },
  { id: 'mariadb', category: 'mainDatabase', name: 'MariaDB' },
  { id: 'mongodb', category: 'mainDatabase', name: 'MongoDB' },
  { id: 'dynamodb', category: 'mainDatabase', name: 'DynamoDB' },
  { id: 'supabase', category: 'mainDatabase', name: 'Supabase' },
  { id: 'firebase', category: 'mainDatabase', name: 'Firebase' },
  { id: 'elasticsearch', category: 'mainDatabase', name: 'Elasticsearch' },
  { id: 'oracle', category: 'mainDatabase', name: 'Oracle' },

  // ORM & Query Builder (Moved from Backend)
  { id: 'prisma', category: 'ormAndQueryBuilder', name: 'Prisma' },
  { id: 'typeorm', category: 'ormAndQueryBuilder', name: 'TypeORM' },
  { id: 'drizzleorm', category: 'ormAndQueryBuilder', name: 'Drizzle ORM' },
  { id: 'mongoose', category: 'ormAndQueryBuilder', name: 'Mongoose' },
  {
    id: 'jpa/hibernate',
    category: 'ormAndQueryBuilder',
    name: 'JPA / Hibernate',
  },
  { id: 'mybatis', category: 'ormAndQueryBuilder', name: 'MyBatis' },
  { id: 'sequelize', category: 'ormAndQueryBuilder', name: 'Sequelize' },
  { id: 'redis', category: 'cachingAndMessageQueue', name: 'Redis' },

  // Caching & Message Queue
  { id: 'kafka', category: 'cachingAndMessageQueue', name: 'Kafka' },
  { id: 'rabbitmq', category: 'cachingAndMessageQueue', name: 'RabbitMQ' },
  { id: 'memcached', category: 'cachingAndMessageQueue', name: 'Memcached' },

  // File Storage (New)
  { id: 's3', category: 'fileStorage', name: 'AWS S3' },
  { id: 'minio', category: 'fileStorage', name: 'MinIO' },
];

export const INFRASTRUCTURE_TECH_STACKS: InfrastructureTechStack[] = [
  // Deployment
  { id: 'aws', category: 'deployment', name: 'AWS' },
  { id: 'gcp', category: 'deployment', name: 'GCP' },
  { id: 'azure', category: 'deployment', name: 'Azure' },
  { id: 'vercel', category: 'deployment', name: 'Vercel' },
  { id: 'netlify', category: 'deployment', name: 'Netlify' },
  { id: 'docker', category: 'deployment', name: 'Docker' },
  { id: 'kubernetes', category: 'deployment', name: 'Kubernetes' },
  { id: 'nginx', category: 'deployment', name: 'Nginx' },
  { id: 'cloudflare', category: 'deployment', name: 'Cloudflare' },

  // CI/CD
  { id: 'githubactions', category: 'CI/CD', name: 'GitHub Actions' },
  { id: 'jenkins', category: 'CI/CD', name: 'Jenkins' },
  { id: 'gitlabci', category: 'CI/CD', name: 'GitLab CI' },
  { id: 'circleci', category: 'CI/CD', name: 'CircleCI' }, // 추가

  // Monitoring & Logging (New)
  { id: 'sentry', category: 'monitoringAndLogging', name: 'Sentry' },
  { id: 'datadog', category: 'monitoringAndLogging', name: 'Datadog' },
  { id: 'grafana', category: 'monitoringAndLogging', name: 'Grafana' },
  { id: 'prometheus', category: 'monitoringAndLogging', name: 'Prometheus' },
];

export const COMMON_TECH_STACKS: CommonTechStack[] = [
  // Languages (Moved from Front/Back)
  { id: 'html5', category: 'language', name: 'HTML5' },
  { id: 'css', category: 'language', name: 'CSS' },
  { id: 'javascript', category: 'language', name: 'JavaScript' },
  { id: 'typescript', category: 'language', name: 'TypeScript' },
  { id: 'java', category: 'language', name: 'Java' },
  { id: 'python', category: 'language', name: 'Python' },
  { id: 'go', category: 'language', name: 'Go' },
  { id: 'rust', category: 'language', name: 'Rust' },
  { id: 'kotlin', category: 'language', name: 'Kotlin' },
  { id: 'swift', category: 'language', name: 'Swift' },
  { id: 'csharp', category: 'language', name: 'C#' },
  { id: 'c++', category: 'language', name: 'C++' },
  { id: 'c', category: 'language', name: 'C' },

  // Package Manager (New)
  { id: 'npm', category: 'packageManager', name: 'npm' },
  { id: 'yarn', category: 'packageManager', name: 'Yarn' },
  { id: 'pnpm', category: 'packageManager', name: 'pnpm' },
  { id: 'bun', category: 'packageManager', name: 'Bun' },

  // Testing (New)
  { id: 'jest', category: 'testing', name: 'Jest' },
  { id: 'vitest', category: 'testing', name: 'Vitest' },
  { id: 'cypress', category: 'testing', name: 'Cypress' },
  { id: 'playwright', category: 'testing', name: 'Playwright' },
  { id: 'storybook', category: 'testing', name: 'Storybook' },

  // Monorepo & Repo Management (New)
  { id: 'turborepo', category: 'monorepoManagement', name: 'Turborepo' },
  { id: 'nx', category: 'monorepoManagement', name: 'Nx' },
  { id: 'git', category: 'monorepoManagement', name: 'Git' },
  { id: 'github', category: 'monorepoManagement', name: 'GitHub' },

  // Code Quality
  { id: 'eslint', category: 'codeQuality', name: 'ESLint' },
  { id: 'prettier', category: 'codeQuality', name: 'Prettier' },
  { id: 'sonarqube', category: 'codeQuality', name: 'SonarQube' },

  // Messenger
  { id: 'slack', category: 'messenger', name: 'Slack' },
  { id: 'discord', category: 'messenger', name: 'Discord' },
  { id: 'msteams', category: 'messenger', name: 'Microsoft Teams' },
  { id: 'kakaotalk', category: 'messenger', name: 'KakaoTalk' },

  // IDE
  { id: 'vscode', category: 'ide', name: 'Visual Studio Code' },
  { id: 'visualstudio', category: 'ide', name: 'Visual Studio' },
  { id: 'cursor', category: 'ide', name: 'Cursor' },
  { id: 'vim', category: 'ide', name: 'Vim' },
  { id: 'pycharm', category: 'ide', name: 'PyCharm' },
  { id: 'intellijidea', category: 'ide', name: 'IntelliJ IDEA' },
  { id: 'pycharm', category: 'ide', name: 'PyCharm' },
  { id: 'sublime', category: 'ide', name: 'Sublime Text' },
  { id: 'riders', category: 'ide', name: 'Rider' },

  // AI
  { id: 'google gemini', category: 'ai', name: 'Google Gemini' },
  { id: 'chatgpt', category: 'ai', name: 'ChatGPT' },
  { id: 'claude', category: 'ai', name: 'Claude' },
  { id: 'github copilot', category: 'ai', name: 'GitHub Copilot' },
  { id: 'grok', category: 'ai', name: 'Grok' },
  { id: 'perplexity', category: 'ai', name: 'Perplexity' },
];

export const TECH_STACK_GROUPS = [
  {
    title: '공통 및 기반',
    items: COMMON_TECH_STACKS,
    categoryMap: {
      language: '언어',
      packageManager: '패키지 매니저',
      testing: '테스트',
      monorepoManagement: '모노레포 관리',
      codeQuality: '코드 퀄리티',
      messenger: '메신저',
      IDE: 'IDE',
      ai: 'AI',
    },
  },
  {
    title: '프론트엔드',
    items: FRONTEND_TECH_STACKS,
    categoryMap: {
      framework: '프레임워크',
      styling: '스타일링',
      stateManagement: '상태 관리',
      uiLibrary: 'UI 라이브러리',
    },
  },
  {
    title: '백엔드',
    items: BACKEND_TECH_STACKS,
    categoryMap: {
      framework: '프레임워크',
      apiArchitecture: 'API 아키텍처',
      documentation: '문서화',
    },
  },
  {
    ai: 'AI',
    title: '데이터베이스 및 스토리지',
    items: DATABASE_TECH_STACKS,
    categoryMap: {
      mainDatabase: '메인 DB',
      ormAndQueryBuilder: 'ORM & 쿼리 빌더',
      cachingAndMessageQueue: '캐싱 & 메시지 큐',
      fileStorage: '파일 스토리지',
    },
  },
  {
    title: '인프라 및 데브옵스',
    items: INFRASTRUCTURE_TECH_STACKS,
    categoryMap: {
      deployment: '배포 환경',
      'CI/CD': 'CI/CD',
      monitoringAndLogging: '모니터링 & 로깅',
    },
  },
];

export const ALL_TECH_STACKS: TechStack[] = [
  ...COMMON_TECH_STACKS,
  ...FRONTEND_TECH_STACKS,
  ...BACKEND_TECH_STACKS,
  ...DATABASE_TECH_STACKS,
  ...INFRASTRUCTURE_TECH_STACKS,
];

// 예외 처리가 필요한 이름들을 매핑(Simple Icons 슬러그 기준)
export const iconMap: Record<string, string> = {
  'React Native': 'react',
  'C#': 'csharp',
  'Express.js': 'express',
  GCP: 'googlecloud',
  NCP: 'naver',
  'Photoshop / Illustrator': 'adobephotoshop',
  'styled-components': 'styledcomponents',
  SvelteKit: 'svelte',
  'TanStack Query': 'tanstack',
  'Shadcn/ui': 'shadcnui',
  'Drizzle ORM': 'drizzle',
  Cassandra: 'apachecassandra',
  'JPA / Hibernate': 'hibernate',
  MyBatis: 'mybatis',
  Kafka: 'kafka',
  'GitLab CI': 'gitlab',
};

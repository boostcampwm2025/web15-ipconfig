// utils/getTechIcon.ts

import { useState } from 'react';

// 예외 처리가 필요한 이름들을 매핑합니다. (Simple Icons 슬러그 기준)
const iconMap: Record<string, string> = {
  'HTML5 / CSS3': 'html5', // 또는 css3, 둘 중 하나 선택 혹은 분리 필요
  'Next.js': 'nextdotjs',
  'React Native': 'react',
  'Kotlin / Jetpack Compose': 'kotlin',
  'Swift / SwiftUI': 'swift',
  'C#': 'csharp',
  'Node.js': 'nodedotjs',
  'Express.js': 'express',
  'Vue.js': 'vuedotjs',
  AWS: 'amazonaws',
  GCP: 'googlecloud',
  Azure: 'microsoftazure',
  NCP: 'naver', // Simple Icons에 없을 수 있음 (대체 필요)
  'Photoshop / Illustrator': 'adobephotoshop',
  Figma: 'figma',
  'styled-components': 'styledcomponents',
  SvelteKit: 'svelte',
  'TanStack Query': 'tanstack',
  'Shadcn/ui': 'shadcnui',
  'Drizzle ORM': 'drizzle',
  TypeORM: 'typeorm',
  Cassandra: 'apachecassandra',
  Sequelize: 'sequelize',
  'JPA / Hibernate': 'hibernate',
  Mongoose: 'mongoose',
  MyBatis: 'mybatis',
  Firebase: 'firebase',
  Supabase: 'supabase',
  PocketBase: 'pocketbase',
  Appwrite: 'appwrite',
  Kafka: 'kafka',
  RabbitMQ: 'rabbitmq',
  Nginx: 'nginx',
  Jenkins: 'jenkins',
  'GitHub Actions': 'githubactions',
  'GitLab CI': 'gitlab',
  Terraform: 'terraform',
  Ansible: 'ansible',
  Docker: 'docker',
  Kubernetes: 'kubernetes',
  Jira: 'jira',
  Trello: 'trello',
  Linear: 'linear',
  Asana: 'asana',
  Confluence: 'confluence',
  Git: 'git',
  GitHub: 'github',
  GitLab: 'gitlab',
  Bitbucket: 'bitbucket',
  // ... 나머지 단순한 이름들은 소문자 변환으로 처리
};

export const getTechIconUrl = (name: string): string => {
  // 1. 매핑된 아이콘이 있는지 확인
  if (iconMap[name]) {
    return `https://cdn.simpleicons.org/${iconMap[name]}`;
  }

  // 2. 특수문자(/)가 포함된 경우 앞부분만 가져오기 (예: "Redux / Redux Toolkit" -> "redux")
  let slug = name.split('/')[0].trim().toLowerCase();

  // 3. 공백 제거 및 점(.) 제거
  slug = slug.replace(/\s+/g, '').replace(/\./g, 'dot');

  // 4. 최종 URL 반환
  return `https://cdn.simpleicons.org/${slug}`;
};

const TechIcon = ({ name }: { name: string }) => {
  const [error, setError] = useState(false);
  const iconUrl = getTechIconUrl(name);

  if (error) {
    // 이미지가 없으면 텍스트(첫 글자)로 보여줌
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
        {name.substring(0, 1)}
      </div>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={name}
      className="h-5 w-5 object-contain"
      onError={() => setError(true)} // 로드 실패 시 에러 상태로 변경
    />
  );
};

export default function TechLabel({ techName }: { techName: string }) {
  return (
    <div className="mb-4 flex cursor-pointer items-center gap-2 rounded-lg border border-gray-700 px-2 py-1 select-none hover:bg-gray-700">
      <TechIcon name={techName} />
      <span className="text-sm font-medium text-gray-300">{techName}</span>
    </div>
  );
}

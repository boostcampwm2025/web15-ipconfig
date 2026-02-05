import {
  FRONTEND_TECH_STACKS,
  BACKEND_TECH_STACKS,
  DATABASE_TECH_STACKS,
  INFRASTRUCTURE_TECH_STACKS,
  COMMON_TECH_STACKS,
} from '@/features/widgets/techStack/constant/techStackInfo';

export const getTechIconUrl = (slug: string, color: string): string => {
  // name이 없거나 빈 문자열인 경우 방어
  if (!slug) return '';

  // 안전하게 호출하도록 변경
  let newSlug = slug.split('/')[0]?.trim().toLowerCase() || '';

  if (!newSlug) return '';

  newSlug = newSlug.replace(/\s+/g, '').replace(/\./g, 'dot');

  return `https://cdn.simpleicons.org/${newSlug}/${color}`;
};

export const getTechStackName = (id: string): string => {
  const techStack = [
    ...FRONTEND_TECH_STACKS,
    ...BACKEND_TECH_STACKS,
    ...DATABASE_TECH_STACKS,
    ...INFRASTRUCTURE_TECH_STACKS,
    ...COMMON_TECH_STACKS,
  ];
  // `tech-stack-${id}` 형태에서 원본 id만 정규식으로 추출
  const match = id.match(/^tech-stack-(.+)$/);

  if (!match) return '';

  const techId = match[1];

  return techStack.find((tech) => tech.id === techId)?.name ?? '';
};

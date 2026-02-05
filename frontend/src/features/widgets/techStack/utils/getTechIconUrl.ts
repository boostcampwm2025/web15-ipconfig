import {
  iconMap,
  FRONTEND_TECH_STACKS,
  BACKEND_TECH_STACKS,
  DATABASE_TECH_STACKS,
  INFRASTRUCTURE_TECH_STACKS,
  COMMON_TECH_STACKS,
} from '@/features/widgets/techStack/constant/techStackInfo';

export const getTechIconUrl = (name: string): string => {
  if (iconMap[name]) {
    return `https://cdn.simpleicons.org/${iconMap[name]}`;
  }

  let slug = name.split('/')[0].trim().toLowerCase();

  slug = slug.replace(/\s+/g, '').replace(/\./g, 'dot');

  return `https://cdn.simpleicons.org/${slug}`;
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

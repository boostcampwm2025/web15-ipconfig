import { iconMap } from '../constant/techStackInfo';

export const getTechIconUrl = (name: string): string => {
  if (iconMap[name]) {
    return `https://cdn.simpleicons.org/${iconMap[name]}`;
  }

  let slug = name.split('/')[0].trim().toLowerCase();

  slug = slug.replace(/\s+/g, '').replace(/\./g, 'dot');

  return `https://cdn.simpleicons.org/${slug}`;
};

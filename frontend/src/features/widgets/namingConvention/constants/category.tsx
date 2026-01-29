import {
  FileCodeIcon,
  ServerIcon,
  DatabaseIcon,
  WrenchIcon,
} from 'lucide-react';
import type { CategoryConfig } from '../types/category';

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    title: 'Frontend',
    titleColor: 'text-indigo-400',
    icon: <FileCodeIcon className="size-4" />,
    description:
      'React 컴포넌트는 일반적으로 PascalCase를 사용하고, prop이나 함수 이름은 주로 camelCase를 사용합니다.',
  },
  {
    id: 'backend',
    label: 'Backend',
    title: 'Backend',
    titleColor: 'text-green-400',
    icon: <ServerIcon className="size-4" />,
    description:
      '백엔드에서는 언어 특성에 따라 camelCase 또는 snake_case를 사용하며, 클래스명은 PascalCase를 사용합니다.',
  },
  {
    id: 'database',
    label: 'Database',
    title: 'Database',
    titleColor: 'text-blue-400',
    icon: <DatabaseIcon className="size-4" />,
    description:
      '데이터베이스에서는 테이블명과 컬럼명에 snake_case를 사용하며, 명확하고 일관된 네이밍을 유지합니다.',
  },
  {
    id: 'common',
    label: 'Common/Utils',
    title: 'Common/Utils',
    titleColor: 'text-purple-400',
    icon: <WrenchIcon className="size-4" />,
    description:
      '공통 유틸리티와 타입 정의는 camelCase 또는 PascalCase를 사용하며, 재사용 가능한 코드의 일관성을 유지합니다.',
  },
];

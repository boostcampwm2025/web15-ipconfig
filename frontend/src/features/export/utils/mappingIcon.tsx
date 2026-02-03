import { SiPrettier } from 'react-icons/si';
import { LuContainer } from 'react-icons/lu';

export function mappingIcon(type: string) {
  switch (type) {
    case 'CODE_FORMAT':
      return (
        <SiPrettier
          size={18}
          color="pink"
          className="text-primary-600 h-5 w-5"
        />
      );
    case 'DOCKERFILE':
      return (
        <LuContainer
          size={18}
          color="#0db7ed"
          className="text-primary-600 h-5 w-5"
        />
      );
    // 임시 데이터입니다
    case 'TECH_STACK':
      return (
        <LuContainer
          size={18}
          color="#0db7ed"
          className="text-primary-600 h-5 w-5"
        />
      );
    default:
      return null;
  }
}

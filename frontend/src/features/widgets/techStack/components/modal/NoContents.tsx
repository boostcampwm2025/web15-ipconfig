import { LuSearchX } from 'react-icons/lu';

export default function NoContents() {
  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center">
      <LuSearchX size={48} className="text-medium text-primary mb-2" />
      <p className="text-muted-foreground">검색 결과가 없습니다</p>
      <p className="text-muted-foreground text-sm">
        다른 키워드로 검색해보세요
      </p>
    </div>
  );
}

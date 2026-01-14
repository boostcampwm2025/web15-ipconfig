import { LuLayers } from 'react-icons/lu';
import SearchBar from './SearchBar';
import { useState, memo, useRef, useCallback } from 'react';
import ModalHeader from './ModalHeader';
import TechStackList from './TechStackList';
import useDebounce from '@/features/widgets/techStack/hooks/useDebounce';
import ReactPortal from '@/common/components/ReactPortal';
import { DragOverlay, useDndContext } from '@dnd-kit/core';
import TechStackItem from '../TechStackItem';

interface TechStackModalProps {
  isOpen: boolean;
  onModalClose: () => void;
  modalRootId?: string;
}

const HEADER_ICON = <LuLayers className="text-purple-400" size={18} />;

function TechStackModal({
  isOpen,
  onModalClose,
  modalRootId,
}: TechStackModalProps) {
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 300);
  const { active } = useDndContext();

  // 모달 위치
  const [position, setPosition] = useState({ x: 600, y: 100 });

  // 드래그 상태
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };

      const handlePointerMove = (e: PointerEvent) => {
        if (!isDragging.current) return;
        setPosition({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y,
        });
      };

      const handlePointerUp = () => {
        isDragging.current = false;
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [position],
  );

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <ReactPortal portalTargetId={modalRootId}>
      <dialog
        onPointerDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        style={{ left: position.x, top: position.y }}
        className="fixed z-999 flex h-150 w-100 flex-col overflow-hidden rounded-xl border border-gray-600 bg-gray-800 shadow-2xl"
      >
        {/* 헤더를 드래그 핸들로 사용 */}
        <ModalHeader
          onPointerDown={handlePointerDown}
          title="기술 스택 찾기"
          icon={HEADER_ICON}
          onClose={onModalClose}
        />

        {/* 내부 컨텐츠 */}
        <div className="flex flex-1 flex-col overflow-hidden px-7 py-4">
          <SearchBar search={search} setSearch={setSearch} />
          <TechStackList keyword={debouncedSearch} />
        </div>
      </dialog>
      <DragOverlay>
        {active?.data.current?.content && (
          <TechStackItem techName={active.data.current.content.name} />
        )}
      </DragOverlay>
    </ReactPortal>
  );
}

export default memo(TechStackModal);

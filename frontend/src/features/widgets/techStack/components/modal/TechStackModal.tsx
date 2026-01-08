import { LuLayers } from 'react-icons/lu';
import SearchBar from './SearchBar';
import { useState, memo, useRef, useCallback } from 'react';
import ModalHeader from './ModalHeader';
import LabelList from './LabelList';
import useDebounce from '../../hooks/useDebounce';
import ReactPortal from '@/common/components/ReactPortal';

interface TechStackModalProps {
  isOpen: boolean;
  onModalClose: () => void;
}

const HEADER_ICON = <LuLayers className="text-purple-400" size={18} />;

function TechStackModal({ isOpen, onModalClose }: TechStackModalProps) {
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 300);

  // 모달 위치
  const [position, setPosition] = useState({ x: 80, y: 100 });

  // 드래그 상태
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        setPosition({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y,
        });
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [position],
  );

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <ReactPortal>
      <div
        style={{ left: position.x, top: position.y }}
        className="dark fixed z-999 flex h-150 w-100 flex-col overflow-hidden rounded-xl border border-gray-600 bg-gray-800 shadow-2xl"
      >
        {/* 헤더를 드래그 핸들로 사용 */}
        <ModalHeader
          onMouseDown={handleMouseDown}
          title="기술 스택 찾기"
          icon={HEADER_ICON}
          onClose={onModalClose}
        />

        {/* 내부 컨텐츠 */}
        <div className="flex flex-1 flex-col overflow-hidden px-7 py-6">
          <SearchBar search={search} setSearch={setSearch} />
          <LabelList keyword={debouncedSearch} />
        </div>
      </div>
    </ReactPortal>
  );
}

export default memo(TechStackModal);

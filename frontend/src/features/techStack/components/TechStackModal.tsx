import { LuLayers } from 'react-icons/lu';
import SearchBar from './SearchBar';
import { useState, memo } from 'react';
import useDebounce from '../hooks/useDebounce';
import ModalHeader from './ModalHeader';
import LabelList from './LabelList';

const HEADER_ICON = <LuLayers className="text-purple-400" size={18} />;

function TechStackModal({ onModalClose }: { onModalClose: () => void }) {
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 300);
  return (
    <div className="fixed top-1/2 left-[80px] z-50 flex h-[80vh] w-[400px] -translate-y-1/2 cursor-auto flex-col rounded-xl border border-blue-400 bg-gray-800 p-5 shadow-2xl">
      <ModalHeader
        title="Tech Stack"
        icon={HEADER_ICON}
        onRemove={onModalClose}
      />
      <SearchBar search={search} setSearch={setSearch} />
      <LabelList keyword={debouncedSearch} />
    </div>
  );
}

export default memo(TechStackModal);

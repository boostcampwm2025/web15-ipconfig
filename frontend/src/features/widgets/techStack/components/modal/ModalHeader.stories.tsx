import type { Meta, StoryObj } from '@storybook/react-vite';
import { LuLayers } from 'react-icons/lu';
import ModalHeader from './ModalHeader';

const meta = {
  title: 'Features/Widgets/TechStack/Modal/ModalHeader',
  component: ModalHeader,
  parameters: {
    layout: 'centered',
  },
  args: {
    title: '기술 스택 찾기',
    icon: <LuLayers className="text-purple-400" size={18} />,
    onClose: () => {},
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ModalHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (props) => (
    <div className="w-[500px] rounded-xl border border-gray-700 bg-gray-800">
      <ModalHeader {...props} />
    </div>
  ),
};

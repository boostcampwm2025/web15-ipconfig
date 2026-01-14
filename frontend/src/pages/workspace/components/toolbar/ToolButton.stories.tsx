import type { Meta, StoryObj } from '@storybook/react-vite';
import ToolButton from './ToolButton';
import {
  LuMousePointer2,
  LuSquare,
  LuCircle,
  LuPencil,
  LuType,
} from 'react-icons/lu';

const meta = {
  title: 'Pages/Workspace/Toolbar/ToolButton',
  component: ToolButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    icon: <LuMousePointer2 size={20} />,
    label: '툴 버튼',
    onClick: () => {},
    active: false,
    disabled: false,
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
      description: '버튼 아이콘',
    },
    label: {
      control: 'text',
      description: '툴팁 라벨',
    },
    onClick: {
      action: 'clicked',
      description: '클릭 핸들러',
    },
    active: {
      control: 'boolean',
      description: '활성화 상태',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
  },
} satisfies Meta<typeof ToolButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <LuMousePointer2 size={20} />,
    label: '선택 도구',
  },
};

export const Active: Story = {
  args: {
    icon: <LuMousePointer2 size={20} />,
    label: '선택 도구',
    active: true,
  },
};

export const Disabled: Story = {
  args: {
    icon: <LuMousePointer2 size={20} />,
    label: '선택 도구',
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    icon: <LuMousePointer2 size={20} />,
  },
};

export const AllTools: Story = {
  render: () => (
    <div className="flex gap-2 rounded-xl border border-gray-700 bg-gray-800 p-2">
      <ToolButton icon={<LuMousePointer2 size={20} />} label="선택" active />
      <ToolButton icon={<LuSquare size={20} />} label="사각형" />
      <ToolButton icon={<LuCircle size={20} />} label="원" />
      <ToolButton icon={<LuPencil size={20} />} label="펜" />
      <ToolButton icon={<LuType size={20} />} label="텍스트" />
    </div>
  ),
};

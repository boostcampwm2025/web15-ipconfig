import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrameworkSelector } from './FrameworkSelector';
import { fn } from 'storybook/test';

const meta = {
  title: 'Features/Widgets/Dockerfile/FrameworkSelector',
  component: FrameworkSelector,
  parameters: {
    layout: 'centered',
  },
  args: {
    selectedId: 'Node.js',
    onSelect: fn(),
  },
  tags: ['autodocs'],
  argTypes: {
    selectedId: {
      control: 'select',
      options: ['Node.js', null],
      description: '선택된 프레임워크',
    },
    onSelect: {
      action: 'selected',
      description: '프레임워크 선택 핸들러',
    },
  },
} satisfies Meta<typeof FrameworkSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NodeJsSelected: Story = {
  args: {
    selectedId: 'Node.js',
    onSelect: fn(),
  },
};

export const NoneSelected: Story = {
  args: {
    selectedId: null,
    onSelect: fn(),
  },
};

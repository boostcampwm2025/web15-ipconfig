import type { Meta, StoryObj } from '@storybook/react-vite';
import SelectedTechItem from './SelectedTechItem';
import { fn } from 'storybook/test';

const meta = {
  title: 'Features/Widgets/TechStack/Widget/SelectedTechItem',
  component: SelectedTechItem,
  parameters: {
    layout: 'centered',
  },
  args: {
    name: 'React',
    slug: 'react',
    color: 'red',
    onRemove: fn(),
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: '기술 스택 이름',
    },
    onRemove: {
      action: 'removed',
      description: '제거 버튼 클릭 핸들러',
    },
  },
} satisfies Meta<typeof SelectedTechItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'React',
    slug: 'react',
    color: 'red',
    onRemove: fn(),
  },
};

export const TypeScript: Story = {
  args: {
    name: 'TypeScript',
    slug: 'typescript',
    color: 'blue',
    onRemove: fn(),
  },
};

export const MultipleItems: Story = {
  render: (args: {
    name: string;
    slug: string;
    color: string;
    onRemove: () => void;
  }) => (
    <div className="flex flex-wrap gap-2">
      <SelectedTechItem
        name={args.name}
        slug={args.slug}
        color={args.color}
        onRemove={args.onRemove}
      />
      <SelectedTechItem
        name="TypeScript"
        slug="typescript"
        color="blue"
        onRemove={args.onRemove}
      />
      <SelectedTechItem
        name="Node.js"
        slug="nodejs"
        color="green"
        onRemove={args.onRemove}
      />
      <SelectedTechItem
        name="Docker"
        slug="docker"
        color="purple"
        onRemove={args.onRemove}
      />
    </div>
  ),
};

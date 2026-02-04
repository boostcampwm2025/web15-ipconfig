import type { Meta, StoryObj } from '@storybook/react-vite';
import TechStackItem from './TechStackItem';

const meta = {
  title: 'Features/Widgets/TechStack/TechStackItem',
  component: TechStackItem,
  parameters: {
    layout: 'centered',
  },
  args: {
    name: 'React',
    slug: 'react',
    color: '61DAFB',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: '기술 스택 이름',
    },
    slug: { control: 'text', description: '기술 스택 slug' },
    color: { control: 'text', description: '기술 스택 색상' },
  },
} satisfies Meta<typeof TechStackItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'React',
    slug: 'react',
    color: '61DAFB',
  },
};

export const TypeScript: Story = {
  args: {
    name: 'TypeScript',
    slug: 'typescript',
    color: '3178C6',
  },
};

export const MultipleTechStacks: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TechStackItem name="React" slug="react" color="61DAFB" />
      <TechStackItem name="TypeScript" slug="typescript" color="3178C6" />
      <TechStackItem name="Node.js" slug="nodejs" color="339933" />
      <TechStackItem name="Docker" slug="docker" color="2496ED" />
      <TechStackItem name="Kubernetes" slug="kubernetes" color="326CE5" />
      <TechStackItem name="PostgreSQL" slug="postgresql" color="336791" />
      <TechStackItem name="MongoDB" slug="mongodb" color="47A248" />
      <TechStackItem name="Redis" slug="redis" color="DC382D" />
    </div>
  ),
};

export const UnknownTech: Story = {
  args: {
    name: 'Unknown Technology',
    slug: 'unknown',
    color: '000000',
  },
};

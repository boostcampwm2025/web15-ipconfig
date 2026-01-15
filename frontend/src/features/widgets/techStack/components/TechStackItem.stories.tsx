import type { Meta, StoryObj } from '@storybook/react-vite';
import TechStackItem from './TechStackItem';

const meta = {
  title: 'Features/Widgets/TechStack/TechStackItem',
  component: TechStackItem,
  parameters: {
    layout: 'centered',
  },
  args: {
    techName: 'React',
  },
  tags: ['autodocs'],
  argTypes: {
    techName: {
      control: 'text',
      description: '기술 스택 이름',
    },
  },
} satisfies Meta<typeof TechStackItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    techName: 'React',
  },
};

export const TypeScript: Story = {
  args: {
    techName: 'TypeScript',
  },
};

export const MultipleTechStacks: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TechStackItem techName="React" />
      <TechStackItem techName="TypeScript" />
      <TechStackItem techName="Node.js" />
      <TechStackItem techName="Docker" />
      <TechStackItem techName="Kubernetes" />
      <TechStackItem techName="PostgreSQL" />
      <TechStackItem techName="MongoDB" />
      <TechStackItem techName="Redis" />
    </div>
  ),
};

export const UnknownTech: Story = {
  args: {
    techName: 'UnknownTechnology',
  },
};

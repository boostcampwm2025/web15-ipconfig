import type { Meta, StoryObj } from '@storybook/react-vite';
import { NodeOptions } from './NodeOptions';
import { fn } from 'storybook/test';
import type { DockerfileData } from '../../types/wizard';

const defaultContent: DockerfileData = {
  framework: 'Node.js',
  version: '22',
  port: 3000,
  packageManager: 'npm',
  command: 'npm run dev',
};

const meta = {
  title: 'Features/Widgets/Dockerfile/Wizard/NodeOptions',
  component: NodeOptions,
  parameters: {
    layout: 'centered',
  },
  args: {
    content: defaultContent,
    onChange: fn(),
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      description: 'Dockerfile 설정 데이터',
    },
    onChange: {
      action: 'changed',
      description: '설정 변경 핸들러',
    },
  },
} satisfies Meta<typeof NodeOptions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: defaultContent,
    onChange: fn(),
  },
};

export const WithYarn: Story = {
  args: {
    content: {
      ...defaultContent,
      packageManager: 'yarn',
    },
    onChange: fn(),
  },
};

export const WithPnpm: Story = {
  args: {
    content: {
      ...defaultContent,
      packageManager: 'pnpm',
    },
    onChange: fn(),
  },
};

export const Node20: Story = {
  args: {
    content: {
      ...defaultContent,
      version: '20',
    },
    onChange: fn(),
  },
};

export const CustomPort: Story = {
  args: {
    content: {
      ...defaultContent,
      port: 8080,
    },
    onChange: fn(),
  },
};

export const CustomCommand: Story = {
  args: {
    content: {
      ...defaultContent,
      command: 'npm run start:prod',
    },
    onChange: fn(),
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import CursorWithName from './CursorWithName';

const meta = {
  title: 'Common/CursorWithName',
  component: CursorWithName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    nickname: {
      control: 'text',
      description: '사용자 닉네임',
    },
    color: {
      control: 'color',
      description: '커서 색상',
    },
    backgroundColor: {
      control: 'color',
      description: '커서 배경 색상',
    },
    x: {
      control: 'number',
      description: 'X 좌표',
    },
    y: {
      control: 'number',
      description: 'Y 좌표',
    },
  },
} satisfies Meta<typeof CursorWithName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    nickname: 'User1',
    color: '#3B82F6',
    backgroundColor: '#FFFFFF',
    x: 0,
    y: 0,
  },
};

export const RedCursor: Story = {
  args: {
    nickname: 'RedUser',
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    x: 0,
    y: 0,
  },
};

export const GreenCursor: Story = {
  args: {
    nickname: 'GreenUser',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    x: 0,
    y: 0,
  },
};

export const PurpleCursor: Story = {
  args: {
    nickname: 'PurpleUser',
    color: '#8B5CF6',
    backgroundColor: '#EDE9FE',
    x: 0,
    y: 0,
  },
};

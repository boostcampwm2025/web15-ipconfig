import type { Meta, StoryObj } from '@storybook/react-vite';
import CursorWithName from '../CursorWithName';

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
    nickname: '행복한 너구리',
    color: '#3B82F6',
    x: 0,
    y: 0,
  },
};

export const LightBackground: Story = {
  args: {
    nickname: '바쁜 원숭이',
    color: '#D6F8C3',
    x: 0,
    y: 0,
  },
};

export const RedCursor: Story = {
  args: {
    nickname: '즐거운 고양이',
    color: '#EF4444',
    x: 0,
    y: 0,
  },
};

export const GreenCursor: Story = {
  args: {
    nickname: '편안한 강아지',
    color: '#10B981',
    x: 0,
    y: 0,
  },
};

export const PurpleCursor: Story = {
  args: {
    nickname: '자유로운 토끼',
    color: '#8B5CF6',
    x: 0,
    y: 0,
  },
};

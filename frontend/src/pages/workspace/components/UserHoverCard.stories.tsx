import type { Meta, StoryObj } from '@storybook/react-vite';
import UserHoverCard from './UserHoverCard';
import type { User } from '@/common/types/user';

const meta = {
  title: 'Pages/Workspace/UserHoverCard',
  component: UserHoverCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    user: {
      control: 'object',
      description: '사용자 정보',
    },
    position: {
      control: 'object',
      description: '카드 위치',
    },
  },
} satisfies Meta<typeof UserHoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUser: User = {
  id: '1',
  name: '김개발',
  role: 'Frontend Developer',
  color: 'bg-blue-400',
  textColor: 'text-blue-400',
  status: '작업중',
  time: '오전 9:00 - 오후 6:00',
  style: '빠른 개발과 실험을 선호',
  activity: [60, 80, 70, 90, 65, 75, 85],
};

export const Default: Story = {
  args: {
    user: mockUser,
    position: { top: 100, left: 100 },
  },
};

export const BackendDeveloper: Story = {
  args: {
    user: {
      ...mockUser,
      id: '2',
      name: '이서버',
      role: 'Backend Developer',
      color: 'bg-green-400',
      textColor: 'text-green-400',
      time: '오전 10:00 - 오후 7:00',
      style: '체계적이고 안정적인 개발',
      activity: [70, 65, 80, 75, 85, 90, 80],
    },
    position: { top: 150, left: 150 },
  },
};

export const Designer: Story = {
  args: {
    user: {
      ...mockUser,
      id: '3',
      name: '박디자인',
      role: 'UI/UX Designer',
      color: 'bg-purple-400',
      textColor: 'text-purple-400',
      status: '준비중',
      time: '오전 11:00 - 오후 8:00',
      style: '사용자 중심 디자인',
      activity: [55, 70, 85, 80, 75, 90, 95],
    },
    position: { top: 200, left: 200 },
  },
};

export const HighActivity: Story = {
  args: {
    user: {
      ...mockUser,
      activity: [90, 95, 88, 92, 85, 98, 100],
    },
    position: { top: 100, left: 100 },
  },
};

export const LowActivity: Story = {
  args: {
    user: {
      ...mockUser,
      activity: [20, 30, 25, 35, 28, 32, 30],
    },
    position: { top: 100, left: 100 },
  },
};

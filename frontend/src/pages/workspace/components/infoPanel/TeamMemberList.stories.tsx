import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import TeamMemberList from './TeamMemberList';

const meta = {
  title: 'Pages/Workspace/InfoPanel/TeamMemberList',
  component: TeamMemberList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: '320px', minHeight: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TeamMemberList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onUserHover: fn(),
    onUserLeave: fn(),
  },
};

export const WithInteraction: Story = {
  args: {
    onUserHover: fn(),
    onUserLeave: fn(),
  },
};

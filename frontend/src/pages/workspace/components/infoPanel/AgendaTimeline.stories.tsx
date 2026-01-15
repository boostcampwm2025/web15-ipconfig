import type { Meta, StoryObj } from '@storybook/react-vite';
import AgendaTimeline from './AgendaTimeline';

const meta = {
  title: 'Pages/Workspace/InfoPanel/AgendaTimeline',
  component: AgendaTimeline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: '320px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AgendaTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

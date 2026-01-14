import type { Meta, StoryObj } from '@storybook/react-vite';
import { LuFileText } from 'react-icons/lu';
import WidgetHeader from './WidgetHeader';

const meta = {
  title: 'Common/Widget/WidgetHeader',
  component: WidgetHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '위젯 제목',
    },
    icon: {
      control: false,
      description: '위젯 아이콘',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WidgetHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '위젯 제목',
    icon: <LuFileText size={18} />,
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import WorkspaceHeader from './WorkspaceHeader';

const meta = {
  title: 'Pages/Workspace/WorkspaceHeader',
  component: WorkspaceHeader,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#111827' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onExportClick: {
      action: 'export clicked',
      description: '내보내기 버튼 클릭 핸들러',
    },
  },
} satisfies Meta<typeof WorkspaceHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onExportClick: fn(),
  },
};

export const WithActions: Story = {
  args: {
    onExportClick: () => {
      alert('문서를 내보냅니다!');
    },
  },
};

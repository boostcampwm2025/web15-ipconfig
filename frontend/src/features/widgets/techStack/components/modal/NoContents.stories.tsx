import type { Meta, StoryObj } from '@storybook/react-vite';
import NoContents from './NoContents';

const meta = {
  title: 'Features/Widgets/TechStack/Modal/NoContents',
  component: NoContents,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NoContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

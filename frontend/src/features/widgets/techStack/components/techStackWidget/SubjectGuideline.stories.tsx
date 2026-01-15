import type { Meta, StoryObj } from '@storybook/react-vite';
import SubjectGuideline from './SubjectGuideline';

const meta = {
  title: 'Features/Widgets/TechStack/Widget/SubjectGuideline',
  component: SubjectGuideline,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SubjectGuideline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: '프론트엔드',
    option: '프레임워크',
  },
};

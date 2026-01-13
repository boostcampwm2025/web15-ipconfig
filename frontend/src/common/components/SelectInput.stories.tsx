import type { Meta, StoryObj } from '@storybook/react-vite';
import SelectInput from './SelectInput';

const meta = {
  title: 'Common/SelectInput',
  component: SelectInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    initialOptions: [
      {
        category: '프론트엔드',
        options: ['Next.js', 'React', 'Vue', 'Angular', 'Svelte'],
      },
      {
        category: '백엔드',
        options: ['Node.js', 'Express', 'Django', 'Flask', 'Spring'],
      },
    ],
  },
} satisfies Meta<typeof SelectInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <SelectInput {...args} />,
};

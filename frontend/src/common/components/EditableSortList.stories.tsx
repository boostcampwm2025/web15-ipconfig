import type { Meta, StoryObj } from '@storybook/react-vite';
import EditableSortList from './EditableSortList';
import { userEvent, within } from 'storybook/test';

const meta = {
  title: 'Project/EditableSortList',
  component: EditableSortList,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EditableSortList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithItems: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addItem = async (name: string) => {
      const addButton = canvas.queryByText('+ 추가');
      if (addButton) {
        await userEvent.click(addButton);
      }

      const input = await canvas.findByPlaceholderText('이름 입력');
      await userEvent.type(input, name);

      const createButton = canvas.getByText('생성');
      await userEvent.click(createButton);
    };

    await addItem('기획 단계');
    await addItem('디자인 진행중');
    await addItem('개발 완료');
  },
};

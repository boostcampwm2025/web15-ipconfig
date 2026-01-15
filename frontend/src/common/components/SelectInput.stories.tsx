import type { Meta, StoryObj } from '@storybook/react-vite';
import SelectInput from './SelectInput';
import { useState } from 'react';

const meta = {
  title: 'Common/SelectInput',
  component: SelectInput,
  parameters: {
    layout: 'padded',
  },
  args: {
    selectedValue: '',
    setSelectedValue: () => {},
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState('');

    return (
      <SelectInput
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />
    );
  },
};

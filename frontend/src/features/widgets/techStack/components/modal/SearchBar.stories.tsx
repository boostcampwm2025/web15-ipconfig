import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import SearchBar from './SearchBar';

const meta = {
  title: 'Features/Widgets/TechStack/Modal/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  args: {
    search: '',
    setSearch: () => {},
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    return <SearchBar search={search} setSearch={setSearch} />;
  },
};

export const WithText: Story = {
  render: () => {
    const [search, setSearch] = useState('React');
    return <SearchBar search={search} setSearch={setSearch} />;
  },
};

export const Empty: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    return <SearchBar search={search} setSearch={setSearch} />;
  },
};

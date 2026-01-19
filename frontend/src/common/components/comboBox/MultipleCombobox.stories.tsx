import type { Meta, StoryObj } from '@storybook/react-vite';
import MultipleCombobox from './MultipleCombobox';
import { useState } from 'react';

const meta = {
  title: 'Common/ComboBox/MultipleCombobox',
  component: MultipleCombobox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    itemList: {
      control: 'object',
      description: '콤보박스에 표시될 아이템 리스트',
    },
    placeholder: {
      control: 'text',
      description: '검색 입력창 플레이스홀더',
    },
    emptyMessage: {
      control: 'text',
      description: '검색 결과가 없을 때 표시되는 메시지',
    },
    value: {
      control: 'object',
      description: '현재 선택된 값들의 배열',
    },
  },
} satisfies Meta<typeof MultipleCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'next', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt.js' },
];

export const Default: Story = {
  args: {
    itemList: sampleItems,
    placeholder: '검색해주세요...',
    emptyMessage: '검색 결과가 없습니다.',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return <MultipleCombobox {...args} value={value} setValue={setValue} />;
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    itemList: sampleItems,
    placeholder: '프레임워크를 여러 개 선택하세요',
    emptyMessage: '해당 프레임워크를 찾을 수 없습니다.',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return <MultipleCombobox {...args} value={value} setValue={setValue} />;
  },
};

export const WithPreselectedValues: Story = {
  args: {
    itemList: sampleItems,
    placeholder: '검색해주세요...',
    emptyMessage: '검색 결과가 없습니다.',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['react', 'vue']);
    return <MultipleCombobox {...args} value={value} setValue={setValue} />;
  },
};

export const WithLargeList: Story = {
  args: {
    itemList: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'csharp', label: 'C#' },
      { value: 'cpp', label: 'C++' },
      { value: 'go', label: 'Go' },
      { value: 'rust', label: 'Rust' },
      { value: 'kotlin', label: 'Kotlin' },
      { value: 'swift', label: 'Swift' },
      { value: 'ruby', label: 'Ruby' },
      { value: 'php', label: 'PHP' },
    ],
    placeholder: '프로그래밍 언어를 여러 개 선택하세요',
    emptyMessage: '해당 언어를 찾을 수 없습니다.',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return <MultipleCombobox {...args} value={value} setValue={setValue} />;
  },
};

export const WithManyPreselectedValues: Story = {
  args: {
    itemList: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'csharp', label: 'C#' },
      { value: 'cpp', label: 'C++' },
      { value: 'go', label: 'Go' },
      { value: 'rust', label: 'Rust' },
    ],
    placeholder: '프로그래밍 언어를 선택하세요',
    emptyMessage: '해당 언어를 찾을 수 없습니다.',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([
      'javascript',
      'typescript',
      'python',
      'rust',
    ]);
    return <MultipleCombobox {...args} value={value} setValue={setValue} />;
  },
};

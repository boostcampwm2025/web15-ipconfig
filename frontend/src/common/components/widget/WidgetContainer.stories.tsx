import type { Meta, StoryObj } from '@storybook/react-vite';
import WidgetContainer from './WidgetContainer';
import WidgetHeader from './WidgetHeader';
import { LuFileText } from 'react-icons/lu';

const meta = {
  title: 'Common/Widget/WidgetContainer',
  component: WidgetContainer,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    id: 'widget-default',
    x: 0,
    y: 0,
    width: 300,
    height: 200,
    zIndex: 1,
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: '위젯 ID',
    },
    x: {
      control: 'number',
      description: 'X 좌표',
    },
    y: {
      control: 'number',
      description: 'Y 좌표',
    },
    width: {
      control: 'number',
      description: '위젯 너비',
    },
    height: {
      control: 'number',
      description: '위젯 높이',
    },
    zIndex: {
      control: 'number',
      description: 'Z-Index',
    },
  },
} satisfies Meta<typeof WidgetContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    x: 100,
    y: 100,
    id: 'widget-1',
    width: 300,
    height: 200,
    zIndex: 1,
    children: (
      <>
        <WidgetHeader
          title="샘플 위젯"
          icon={<LuFileText size={18} />}
          onClickDelete={() => {}}
          onDrag={() => {}}
        />
        <div className="text-white">
          <p>위젯 컨텐츠 영역</p>
        </div>
      </>
    ),
  },
};

export const SmallWidget: Story = {
  args: {
    x: 50,
    y: 50,
    id: 'widget-2',
    width: 200,
    height: 150,
    zIndex: 1,
    children: (
      <>
        <WidgetHeader
          title="작은 위젯"
          icon={<LuFileText size={18} />}
          onClickDelete={() => {}}
          onDrag={() => {}}
        />
        <div className="text-sm text-white">
          <p>작은 크기의 위젯</p>
        </div>
      </>
    ),
  },
};

export const LargeWidget: Story = {
  args: {
    x: 150,
    y: 150,
    id: 'widget-3',
    width: 500,
    height: 400,
    zIndex: 1,
    children: (
      <>
        <WidgetHeader
          title="큰 위젯"
          icon={<LuFileText size={18} />}
          onClickDelete={() => {}}
          onDrag={() => {}}
        />
        <div className="text-white">
          <p>큰 크기의 위젯입니다.</p>
          <p className="mt-2">더 많은 컨텐츠를 담을 수 있습니다.</p>
          <ul className="mt-4 space-y-2">
            <li>• 리스트 항목 1</li>
            <li>• 리스트 항목 2</li>
            <li>• 리스트 항목 3</li>
          </ul>
        </div>
      </>
    ),
  },
};

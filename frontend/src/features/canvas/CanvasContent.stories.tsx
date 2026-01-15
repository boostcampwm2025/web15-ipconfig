import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import CanvasContent from './CanvasContent';
import type { Camera } from '@/common/types/camera';
import type { Cursor } from '@/common/types/cursor';

const dummyRef = { current: null } as React.RefObject<HTMLDivElement | null>;

const meta = {
  title: 'Features/Canvas/CanvasContent',
  component: CanvasContent,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    camera: { x: 0, y: 0, scale: 1 },
    containerRef: dummyRef,
    handlePointerDown: () => {},
    handlePointerMove: () => {},
    handlePointerUp: () => {},
    isPanning: false,
    remoteCursor: {},
    widgets: {},
    emitUpdateWidget: () => {},
    emitDeleteWidget: () => {},
    emitMoveWidget: () => {},
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CanvasContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCursors: Record<string, Cursor> = {
  user1: {
    userId: 'user1',
    nickname: 'User 1',
    color: '#3B82F6',
    backgroundColor: '#DBEAFE',
    x: 100,
    y: 100,
  },
  user2: {
    userId: 'user2',
    nickname: 'User 2',
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    x: 200,
    y: 150,
  },
  user3: {
    userId: 'user3',
    nickname: 'User 3',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    x: 300,
    y: 200,
  },
};

export const Default: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [camera] = useState<Camera>({ x: 0, y: 0, scale: 1 });
    const [isPanning] = useState(false);

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <CanvasContent
          camera={camera}
          containerRef={containerRef}
          handlePointerDown={() => {}}
          handlePointerMove={() => {}}
          handlePointerUp={() => {}}
          isPanning={isPanning}
          remoteCursor={{}}
          widgets={{}}
          emitUpdateWidget={() => {}}
          emitDeleteWidget={() => {}}
          emitMoveWidget={() => {}}
        />
      </div>
    );
  },
};

export const WithCursors: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [camera] = useState<Camera>({ x: 0, y: 0, scale: 1 });
    const [isPanning] = useState(false);

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <CanvasContent
          camera={camera}
          containerRef={containerRef}
          handlePointerDown={() => {}}
          handlePointerMove={() => {}}
          handlePointerUp={() => {}}
          isPanning={isPanning}
          remoteCursor={mockCursors}
          widgets={{}}
          emitUpdateWidget={() => {}}
          emitDeleteWidget={() => {}}
          emitMoveWidget={() => {}}
        />
      </div>
    );
  },
};

export const Zoomed: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [camera] = useState<Camera>({ x: 0, y: 0, scale: 1.5 });
    const [isPanning] = useState(false);

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <CanvasContent
          camera={camera}
          containerRef={containerRef}
          handlePointerDown={() => {}}
          handlePointerMove={() => {}}
          handlePointerUp={() => {}}
          isPanning={isPanning}
          remoteCursor={mockCursors}
          widgets={{}}
          emitUpdateWidget={() => {}}
          emitDeleteWidget={() => {}}
          emitMoveWidget={() => {}}
        />
      </div>
    );
  },
};

export const Panning: Story = {
  render: () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [camera] = useState<Camera>({ x: -200, y: -100, scale: 1 });
    const [isPanning] = useState(true);

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <CanvasContent
          camera={camera}
          containerRef={containerRef}
          handlePointerDown={() => {}}
          handlePointerMove={() => {}}
          handlePointerUp={() => {}}
          isPanning={isPanning}
          remoteCursor={mockCursors}
          widgets={{}}
          emitUpdateWidget={() => {}}
          emitDeleteWidget={() => {}}
          emitMoveWidget={() => {}}
        />
      </div>
    );
  },
};

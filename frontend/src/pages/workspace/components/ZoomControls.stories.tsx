import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import ZoomControls from './ZoomControls';
import type { Camera } from '@/common/types/camera';

const meta = {
  title: 'Pages/Workspace/ZoomControls',
  component: ZoomControls,
  parameters: {
    layout: 'none',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ZoomControls>;

export default meta;
type Story = StoryObj<typeof meta>;

// 공통 렌더 함수
const renderZoomControls = (initialScale: number, label?: string) => {
  return () => {
    const [camera, setCamera] = useState<Camera>({
      x: 0,
      y: 0,
      scale: initialScale,
    });

    const handleZoom = (delta: number) => {
      setCamera((prev) => ({
        ...prev,
        scale: Math.max(0.1, Math.min(3, prev.scale + delta)),
      }));
    };

    return (
      <div
        className="relative h-[100px] w-full"
        // style={{ width: '400px', height: '250px' }}
      >
        <ZoomControls handleZoomButton={handleZoom} camera={camera} />
        {label && (
          <div className="absolute top-4 left-6 text-sm text-white">
            {label}
          </div>
        )}
      </div>
    );
  };
};

export const Default: Story = {
  args: {
    handleZoomButton: () => {},
    camera: { x: 0, y: 0, scale: 1 },
  },
  render: renderZoomControls(1),
};

export const MinZoom: Story = {
  args: {
    handleZoomButton: () => {},
    camera: { x: 0, y: 0, scale: 0.1 },
  },
  render: renderZoomControls(0.1, '최소 줌 레벨 (10%)'),
};

export const MaxZoom: Story = {
  args: {
    handleZoomButton: () => {},
    camera: { x: 0, y: 0, scale: 5 },
  },
  render: renderZoomControls(3, '최대 줌 레벨 (500%)'),
};

export const MidZoom: Story = {
  args: {
    handleZoomButton: () => {},
    camera: { x: 0, y: 0, scale: 1.5 },
  },
  render: renderZoomControls(1.5, '중간 줌 레벨 (150%)'),
};

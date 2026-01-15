import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import TechStackModal from './TechStackModal';

const meta = {
  title: 'Features/Widgets/TechStack/Modal/TechStackModal',
  component: TechStackModal,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    isOpen: true,
    onModalClose: () => {},
    modalRootId: 'storybook-root',
  },
} satisfies Meta<typeof TechStackModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ isOpen }) => {
    const [open, setOpen] = useState(isOpen);

    return (
      <DndContext>
        <div className="h-screen w-screen bg-slate-900">
          <TechStackModal
            isOpen={open}
            onModalClose={() => setOpen(false)}
            modalRootId="storybook-root"
          />
        </div>
      </DndContext>
    );
  },
};

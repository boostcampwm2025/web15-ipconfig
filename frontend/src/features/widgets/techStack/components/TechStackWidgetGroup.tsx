import { DndContext, pointerWithin } from '@dnd-kit/core';
import { type ReactNode } from 'react';

interface TechStackWidgetGroupProps {
  children: ReactNode;
}

export function TechStackWidgetGroup({ children }: TechStackWidgetGroupProps) {
  return <DndContext collisionDetection={pointerWithin}>{children}</DndContext>;
}

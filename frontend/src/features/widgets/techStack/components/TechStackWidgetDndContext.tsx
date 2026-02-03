import { DndContext, pointerWithin } from '@dnd-kit/core';
import { type ReactNode } from 'react';

interface TechStackWidgetDndContextProps {
  children: ReactNode;
}

export function TechStackWidgetDndContext({
  children,
}: TechStackWidgetDndContextProps) {
  return <DndContext collisionDetection={pointerWithin}>{children}</DndContext>;
}

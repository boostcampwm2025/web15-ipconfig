import type { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

type ReactPortalProps = {
  parent: HTMLElement;
} & PropsWithChildren;

export default function ReactPortal({
  parent = document.body,
  children,
}: ReactPortalProps) {
  return parent && createPortal(children, parent);
}

import type { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

type ReactPortalProps = {
  parent?: HTMLElement;
} & PropsWithChildren;

const defaultRoot = document.getElementById('root') as HTMLElement;

export default function ReactPortal({
  parent = defaultRoot,
  children,
}: ReactPortalProps) {
  return parent && createPortal(children, parent);
}

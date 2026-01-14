import type { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

type ReactPortalProps = {
  portalTargetId?: string;
} & PropsWithChildren;

export default function ReactPortal({
  portalTargetId = 'root',
  children,
}: ReactPortalProps) {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // 클라이언트 사이드에서 타겟 엘리먼트 확인
    setTarget(document.getElementById(portalTargetId));
  }, [portalTargetId]);

  if (!target) return null;

  return createPortal(children, target);
}

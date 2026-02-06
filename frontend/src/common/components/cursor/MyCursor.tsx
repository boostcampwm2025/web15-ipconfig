import { getBrightenedColor } from '@/utils/color';
import {
  clearUserChatMessage,
  updateUserCursorType,
} from '@/common/api/yjs/awareness';
import type { CursorProps } from './type';
import { useEffect, useRef, useState } from 'react';
import { LuMousePointer2 } from 'react-icons/lu';
import { AnimatePresence, motion } from 'framer-motion';
import ChatBubble from './ChatBubble';

interface MyCursorProps extends CursorProps {
  scale?: number;
}

const CURSOR_CHAT_TIMEOUT = 4500;

function MyCursor({ color, type, message, scale = 1 }: MyCursorProps) {
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // '/' 키로 채팅 모드 토글
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // 이미 채팅 모드일 때는 '/' 키를 input에 입력할 수 있도록 허용
      if (e.key === '/' && type !== 'chat') {
        e.preventDefault();
        updateUserCursorType('chat');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [type]);

  // 마지막 입력 후 3초 뒤 자동으로 채팅 모드 종료
  useEffect(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }

    if (type === 'chat') {
      autoCloseTimerRef.current = setTimeout(() => {
        clearUserChatMessage();
      }, CURSOR_CHAT_TIMEOUT);
    }

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [type, message]);

  const inverseScale = 1 / scale;

  return (
    <AnimatePresence mode="wait">
      {type === 'chat' && (
        <motion.div
          key="my-cursor-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0 }}
          className="pointer-events-none absolute -translate-x-1 -translate-y-1 select-none"
          style={{
            transform: `scale(${inverseScale})`,
            transformOrigin: '0 0',
          }}
        >
          <LuMousePointer2
            className="size-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
            style={{
              color: getBrightenedColor(color),
              fill: color,
            }}
          />
          <ChatBubble key="chat-bubble" color={color} message={message || ''} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MyCursor;

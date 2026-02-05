import { getContrastClass } from '@/utils/color';
import { cn } from '@/common/lib/utils';
import { updateUserChatMessage } from '@/common/api/yjs/awareness';
import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const CHAT_PLACEHOLDER = '하고 싶은 말을 입력하세요';

interface ChatBubbleProps {
  color: string;
  message: string;
}

function ChatBubble({ color, message }: ChatBubbleProps) {
  const chatInputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(CHAT_PLACEHOLDER.length);

  // message가 변경되면, chatBubble를 paint 하기 전에 inputWidth 업데이트
  useLayoutEffect(() => {
    if (measureRef.current) {
      setInputWidth(Math.max(80, measureRef.current.scrollWidth + 6));
    }
  }, [message]);

  // 컴포넌트가 마운트되면 포커스
  useLayoutEffect(() => {
    chatInputRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      {/* 메시지 길이에 따른 chat bubble 너비 측정을 위한 span */}
      <span
        ref={measureRef}
        className={cn(
          'invisible absolute top-0 left-0',
          'text-sm font-semibold whitespace-pre',
          'px-3 py-2',
        )}
      >
        {message || CHAT_PLACEHOLDER}
      </span>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.15 }}
        className={cn(
          'absolute top-4 left-3',
          'translate-x-1.5 translate-y-0.5 rounded-lg rounded-tl-none px-3 py-2 font-semibold whitespace-nowrap',
          getContrastClass(color),
        )}
        style={{
          backgroundColor: color,
          width: `${inputWidth}px`,
        }}
      >
        <input
          type="text"
          ref={chatInputRef}
          placeholder={CHAT_PLACEHOLDER}
          maxLength={50}
          className="w-full border-none text-sm outline-none"
          value={message}
          onBlur={(e) => {
            e.target.focus({ preventScroll: true });
          }}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 50) {
              updateUserChatMessage(value);
            }
          }}
        />
      </motion.div>
    </>
  );
}

export default ChatBubble;

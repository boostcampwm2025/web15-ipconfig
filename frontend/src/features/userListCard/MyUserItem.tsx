import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/common/components/shadcn/avatar';
import { Separator } from '@/common/components/shadcn/separator';
import { cn } from '@/common/lib/utils';
import { getContrastClass } from '@/utils/color';
import { Pencil } from 'lucide-react';
import { Input } from '@/common/components/shadcn/input';
import { updateUserNickname } from '@/common/api/yjs/awareness';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserSchema } from '@/common/schemas/userSchema';
import { useUserInfoById } from '@/common/store/user';
import { Button } from '@/common/components/shadcn/button';

interface MyUserItemProps {
  userId: string;
}

function MyUserItem({ userId }: MyUserItemProps) {
  const user = useUserInfoById(userId);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      nickname: user?.nickname ?? '',
    },
  });

  useEffect(() => {
    if (isEditing) {
      setFocus('nickname');
    } else {
      reset({ nickname: user?.nickname ?? '' });
    }
  }, [isEditing, user?.nickname, setFocus, reset]);

  const onSubmit = (data: UserSchema) => {
    if (data.nickname !== user?.nickname) {
      updateUserNickname(data.nickname);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!e.nativeEvent.isComposing) {
        handleSubmit(onSubmit)();
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      reset({ nickname: user?.nickname ?? '' });
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="group hover:bg-accent/50 flex h-10 items-center justify-between rounded-lg px-2 text-sm transition-colors select-none">
        <div
          className={cn(
            'flex items-center gap-2.5',
            !isEditing && 'overflow-hidden',
          )}
        >
          {/* 유저 아바타 */}
          <Avatar className="size-7 shrink-0 ring-gray-800!">
            <AvatarFallback
              className={cn(
                getContrastClass(user.color),
                'text-xs font-semibold',
              )}
              style={{ backgroundColor: user.color }}
            >
              {user.nickname[0]}
            </AvatarFallback>
          </Avatar>

          {/* 유저 닉네임 (편집 모드/표시 모드) */}
          {isEditing ? (
            <div className="relative">
              <Input
                {...register('nickname')}
                onKeyDown={handleKeyDown}
                onBlur={handleSubmit(onSubmit)}
                className={cn(
                  'm-2 ml-0 h-7 w-32 px-2 py-1 text-xs',
                  errors.nickname &&
                    'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50',
                )}
              />
              {errors.nickname && (
                <span className="bg-background absolute top-full left-0 z-50 min-w-max rounded px-2 py-1 text-[10px] text-red-500 shadow-md">
                  {errors.nickname.message}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 truncate">
              <span className="truncate font-medium">{user.nickname}</span>
              <span className="mr-2 shrink-0 text-xs text-gray-400">(나)</span>
            </div>
          )}
        </div>

        {/* 편집 버튼 */}
        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <Separator />
    </>
  );
}

export default MyUserItem;

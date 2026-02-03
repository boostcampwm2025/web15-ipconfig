import { useWorkspaceInfoStore } from '@/common/store/workspace';
import { updateWorkspaceTitleAction } from '@/common/api/yjs/actions/workspace';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  workspaceSchema,
  type WorkspaceSchema,
} from '@/common/schemas/workspaceSchema';
import { cn } from '@/common/lib/utils';

export function WorkspaceTitleInput() {
  const { workspaceName } = useWorkspaceInfoStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkspaceSchema>({
    resolver: zodResolver(workspaceSchema),
    mode: 'onChange',
    defaultValues: { title: workspaceName },
  });

  useEffect(() => {
    reset({ title: workspaceName });
  }, [workspaceName, reset]);

  const onSubmit = (data: WorkspaceSchema) => {
    if (data.title !== workspaceName) {
      updateWorkspaceTitleAction(data.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!e.nativeEvent.isComposing) {
        e.currentTarget.blur();
      }
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        {...register('title')}
        onBlur={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        className={cn(
          'focus:border-primary-600/50 focus:ring-primary-600/50 w-full rounded-md border border-transparent bg-transparent px-1 text-base font-bold text-white outline-none focus:ring',
          errors.title &&
            'border-red-500 ring-red-500 focus:border-red-500/50 focus:ring-red-500',
        )}
      />
      {errors.title && (
        <span className="absolute top-full left-0 z-50 mt-1 min-w-max rounded border border-red-500 bg-gray-900 px-2 py-1 text-xs text-red-500 shadow-md">
          {errors.title.message}
        </span>
      )}
    </div>
  );
}

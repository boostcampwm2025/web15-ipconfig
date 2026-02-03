import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';
import { workspaceApi } from '@/common/api/workspaceApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createInviteCodeSchema,
  type CreateInviteCode,
} from '@/common/schemas/createInviteCodeSchema';

export function useCreateWorkspace() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateInviteCode>({
    resolver: zodResolver(createInviteCodeSchema),
    mode: 'onChange',
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: CreateInviteCode) => {
    try {
      const { workspaceId } = await workspaceApi.create({
        workspaceId: data.code === '' ? undefined : data.code,
      });
      navigate(`/workspace/${workspaceId}`);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 409) {
        setError('code', { message: '이미 존재하는 워크스페이스 코드입니다.' });
      } else {
        setError('code', { message: '워크스페이스 생성에 실패했습니다.' });
      }
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
}

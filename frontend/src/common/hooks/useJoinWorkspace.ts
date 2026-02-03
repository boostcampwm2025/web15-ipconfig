import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';
import { workspaceApi } from '@/common/api/workspaceApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { joinCodeSchema, type JoinCode } from '@/common/schemas/joinCodeSchema';

export function useJoinWorkspace() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<JoinCode>({
    resolver: zodResolver(joinCodeSchema),
    mode: 'onChange',
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: JoinCode) => {
    try {
      if (data.code !== '') {
        const { exists } = await workspaceApi.get(data.code);
        if (exists) navigate(`/workspace/${data.code}`);
        else
          setError('code', {
            message: '존재하지 않는 워크스페이스 코드입니다.',
          });
      } else {
        setError('code', { message: '코드를 입력해주세요.' });
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        setError('code', { message: '존재하지 않는 워크스페이스 코드입니다.' });
      } else {
        setError('code', { message: '워크스페이스 참가에 실패했습니다.' });
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

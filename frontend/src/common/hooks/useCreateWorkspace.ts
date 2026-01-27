import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';
import { workspaceApi } from '@/common/api/workspaceApi';

export const useCreateWorkspace = () => {
  const navigate = useNavigate();
  const [createCode, setCreateCode] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  // 생성용 코드 변경
  const handleCreateCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 32) {
      setCreateCode(value.trim());
      setCreateError(null);
    }
  };

  // 백엔드에서 에러 처리를 잘 해놔서, try-catch 사용하기
  const handleCreateWorkspace = async () => {
    setCreateError(null);
    try {
      let workspaceId: string;
      if (createCode) {
        // 코드가 입력된 경우: 특정 ID로 생성
        workspaceId = await workspaceApi.makeWithId(createCode);
      } else {
        // 코드가 없는 경우: 무작위 ID로 생성
        workspaceId = await workspaceApi.make();
      }
      // 생성된 workspaceId로 이동
      navigate(`/workspace/${workspaceId}`);
    } catch (err) {
      // 에러 처리 (이미 존재하는 경우 등)
      if (err instanceof AxiosError && err.response?.status === 409) {
        setCreateError('이미 존재하는 워크스페이스 코드입니다.');
      } else {
        setCreateError('워크스페이스 생성에 실패했습니다.');
      }
    }
  };

  return {
    createCode,
    createError,
    handleCreateCodeChange,
    handleCreateWorkspace,
  };
};

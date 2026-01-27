import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';
import { workspaceApi } from '@/common/api/workspaceApi';

export const useJoinWorkspace = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);

  // 참여용 코드 변경
  const handleJoinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 32) {
      setJoinCode(value.trim());
      setJoinError(null);
    }
  };

  const handleJoinWorkspace = async () => {
    setJoinError(null);
    // 참가는 코드 필수
    if (!joinCode) {
      setJoinError('워크스페이스 코드를 입력해주세요.');
      return;
    }
    try {
      const workspaceId = await workspaceApi.join(joinCode);
      // 참가한 workspaceId로 이동
      navigate(`/workspace/${workspaceId}`);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        setJoinError('존재하지 않는 워크스페이스 코드입니다.');
      } else {
        setJoinError('워크스페이스 참가에 실패했습니다.');
      }
    }
  };

  return {
    joinCode,
    joinError,
    handleJoinCodeChange,
    handleJoinWorkspace,
  };
};

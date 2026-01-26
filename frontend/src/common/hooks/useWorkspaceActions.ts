import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';
import { workspaceApi } from '@/common/api/workspaceApi';

export const useWorkspaceActions = () => {
  const navigate = useNavigate();
  const [workspaceCode, setWorkspaceCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 폼 검증
  // react-form-hook 사용하면 지우기
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 32) {
      setWorkspaceCode(value.trim());
      setError(null);
    }
  };

  // 백엔드에서 에러 처리를 잘 해놔서, try-catch 사용하기
  const handleCreateWorkspace = async () => {
    setError(null);
    try {
      let workspaceId: string;
      if (workspaceCode) {
        // 코드가 입력된 경우: 특정 ID로 생성 (make)
        workspaceId = await workspaceApi.makeWithId(workspaceCode);
      } else {
        // 코드가 없는 경우: 무작위 ID로 생성 (make)
        workspaceId = await workspaceApi.make();
      }
      // 생성된 workspaceId로 이동
      navigate(`/workspace/${workspaceId}`);
    } catch (err) {
      // 에러 처리 (이미 존재하는 경우 등)
      if (err instanceof AxiosError && err.response?.status === 409) {
        // ConflictException은 이미 워크스페이스 코드가 있을 때 발생하는 에러여서 일단 이렇게 했습니다
        setError('이미 존재하는 워크스페이스 코드입니다.');
      } else {
        // 나머지는 서버 오류로 처리하기
        setError('워크스페이스 생성에 실패했습니다.');
      }
    }
  };

  const handleJoinWorkspace = async () => {
    setError(null);
    // 참가는 코드 필수
    if (!workspaceCode) {
      setError('워크스페이스 코드를 입력해주세요.');
      return;
    }
    try {
      const workspaceId = await workspaceApi.join(workspaceCode);
      // 참가한 workspaceId로 이동
      navigate(`/workspace/${workspaceId}`);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        // NotFoundException은 방이 없는 경우 발생하는 에러여서 일단 이렇게 했습니다
        setError('존재하지 않는 워크스페이스 코드입니다.');
      } else {
        // 여기는 서버 오류
        setError('워크스페이스 참가에 실패했습니다.');
      }
    }
  };

  return {
    workspaceCode,
    error,
    handleCodeChange,
    handleCreateWorkspace,
    handleJoinWorkspace,
  };
};

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AxiosError } from 'axios';
import { workspaceApi } from '@/common/api/workspaceApi';

const JoinWorkspacePage = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  useEffect(() => {
    const joinWorkspace = async () => {
      if (!workspaceId) {
        navigate('/', { replace: true });
        return;
      }

      try {
        await workspaceApi.join(workspaceId);
        navigate(`/workspace/${workspaceId}`, { replace: true });
      } catch (error) {
        // 에러 발생 시 랜딩 페이지로 이동
        if (error instanceof AxiosError && error.response?.status === 404) {
          // 워크스페이스가 존재하지 않는 경우
          navigate('/', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    };

    joinWorkspace();
  }, [workspaceId, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-slate-400">워크스페이스에 참가하는 중...</p>
      </div>
    </div>
  );
};

export default JoinWorkspacePage;

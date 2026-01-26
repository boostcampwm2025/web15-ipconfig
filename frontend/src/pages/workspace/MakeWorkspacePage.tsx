import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { workspaceApi } from '@/common/api/workspaceApi';

const MakeWorkspacePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const createWorkspace = async () => {
      try {
        const workspaceId = await workspaceApi.make();
        navigate(`/workspace/${workspaceId}`, { replace: true });
      } catch (error) {
        // 에러 발생 시 랜딩 페이지로 이동
        navigate('/', { replace: true });
      }
    };

    createWorkspace();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-slate-400">워크스페이스를 생성하는 중...</p>
      </div>
    </div>
  );
};

export default MakeWorkspacePage;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';

import { useWorkspaceInfoStore } from '@/common/store/workspace';
import { workspaceApi } from '@/common/api/workspaceApi';

export function useWorkspaceGuard(workspaceId: string | undefined) {
  const navigate = useNavigate();
  const setWorkspaceId = useWorkspaceInfoStore((state) => state.setWorkspaceId);
  const [isReady, setIsReady] = useState(false);
  const [userNickname, setUserNickname] = useState<string | null>(null);

  useEffect(() => {
    // 1. 워크스페이스 ID 자체가 없는 경우
    if (!workspaceId) {
      navigate('/error', {
        state: {
          status: 400,
          title: '잘못된 접근입니다',
          message:
            '워크스페이스 ID가 없어 페이지를 불러올 수 없습니다.\n처음 화면에서 다시 워크스페이스를 생성하거나 참가해주세요.',
        },
      });
      return;
    }

    // 2. URL 상의 워크스페이스 ID 형식 검증
    const isValidFormat = /^[a-z0-9]{1,32}$/.test(workspaceId);
    if (!isValidFormat) {
      navigate('/error', {
        state: {
          status: 400,
          title: '잘못된 워크스페이스 주소입니다',
          message: `'${workspaceId}' 는 유효하지 않은 워크스페이스 ID입니다.\n영소문자와 숫자만 사용 가능하며, 1~32자 이내여야 합니다.\n처음 화면에서 올바른 코드로 참가해주세요.`,
        },
      });
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    // 3. 서버에 해당 워크스페이스가 실제로 존재하는지 검증
    const verifyWorkspace = async () => {
      try {
        // join API를 통해 존재 여부 및 서버 상태 확인
        const { nickname } = await workspaceApi.join(workspaceId, { signal });

        // 서버 검증까지 통과한 경우에만 전역 스토어에 동기화
        setWorkspaceId(workspaceId);
        setIsReady(true);
        setUserNickname(nickname);
      } catch (error) {
        // AbortController 취소 시 Axios는 AxiosError(code: 'ERR_CANCELED')를 던짐. name은 'AbortError'가 아님.
        if (error instanceof AxiosError && error.code === 'ERR_CANCELED')
          return;

        // 서버가 응답을 주는 경우 (404, 5xx 등)
        if (error instanceof AxiosError && error.response) {
          const status = error.response.status;

          if (status === 404) {
            navigate('/error', {
              state: {
                status: 404,
                title: '워크스페이스를 찾을 수 없습니다',
                message:
                  '해당 워크스페이스가 존재하지 않습니다.\n코드를 다시 확인하거나 홈에서 새로운 워크스페이스를 생성해주세요.',
              },
            });
            return;
          }

          // 그 외 서버에서 온 에러는 모두 서버 오류로 처리
          navigate('/error', {
            state: {
              status: status >= 500 ? status : 500,
              title: '서버 오류가 발생했습니다',
              message:
                '서버와 통신 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
            },
          });
          return;
        }

        // 서버에 아예 연결되지 않는 경우 (백엔드 꺼짐, 네트워크 오류 등)
        navigate('/error', {
          state: {
            status: 500,
            title: '서버 오류가 발생했습니다',
            message: '서버와 연결할 수 없습니다.\n잠시 후 다시 시도해주세요.',
          },
        });
      }
    };

    verifyWorkspace();

    return () => {
      controller.abort();
    };
  }, [workspaceId, navigate, setWorkspaceId]);

  return {
    isReady,
    userNickname,
  };
}

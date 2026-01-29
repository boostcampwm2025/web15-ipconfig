import { useLocation, useNavigate } from 'react-router';
import type { ErrorState } from '@/common/types/errorState';

export function useErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as ErrorState) ?? {};

  const status = state.status ?? 404;
  const title = state.title ?? '페이지를 찾을 수 없어요';
  const message =
    state.message ?? '존재하지 않는 페이지입니다.\n주소를 다시 확인해주세요.';

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return {
    title,
    message,
    status,
    handleGoHome,
    handleGoBack,
  };
}

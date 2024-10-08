import { Outlet, Navigate } from 'react-router-dom';
import useQuestionStore from '../../store/zustand';

function RequireAuth() {
  const { auth } = useQuestionStore();

  return auth?.email ? <Navigate to={'/'} replace={true} /> : <Outlet />;
}

export default RequireAuth;

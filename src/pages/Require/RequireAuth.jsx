import { Outlet } from 'react-router-dom';

function RequireAuth() {
  // Simply return the Outlet component to allow access to child routes
  return <Outlet />;
}

export default RequireAuth;

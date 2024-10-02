import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSessionStorage } from '../../@hooks';

export const RequireAuth = ({ children }) => {
  const { storedValue } = useSessionStorage('login');
  const location = useLocation();

  if (storedValue) {
    if (location.pathname !== '/login') {
      return children;
    }
    return <Navigate to="/main" state={{ from: location }} replace />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default React.memo(RequireAuth);

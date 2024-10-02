// import { Suspense } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Backdrop /* CircularProgress */ } from '@mui/material';
// import RequireAuth from './RequireAuth';

export const LoadingPage = () => {
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'white',
      }}
      open={true}
    >
      {/* <CircularProgress color="inherit" /> */}
      <img src="/img/gif/loading_1.gif" alt="" />
    </Backdrop>
  );
};

const GenerateRoutes = ({ routes = [] }) => {
  return (
    <Routes>
      {routes.map(({ to, path, Component, requiredAuth }) => (
        <Route
          key={to}
          path={path}
          element={
            requiredAuth ? (
              <RequireAuth>
                <Component />
              </RequireAuth>
            ) : (
              <Component />
            )
          }
        />
      ))}

      <Route path="/*" element={<Navigate to={routes[0].to} replace />} />
    </Routes>
  );
};

const Navigation = ({ onlyRoutes = false, routes = [], fromUseRoutes }) => {
  return (
    <Suspense fallback={<LoadingPage />}>
      {onlyRoutes ? (
        <GenerateRoutes routes={routes} />
      ) : (
        <BrowserRouter>
          {fromUseRoutes ? fromUseRoutes : <GenerateRoutes routes={routes} />}
        </BrowserRouter>
      )}
    </Suspense>
  );
};

export default Navigation;

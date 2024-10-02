import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AbilityBuilder } from '@casl/ability';
import authConfigTokens from '@config/authConfig/tokens';
import { authUrl } from '@config/endpointConfig';
import { useAxios, useLocalStorage, useSessionStorage } from '@hooks';
import { cryptoUtil, permissions as authPermissions } from '@utils';
import { setTheme } from '../store/theme';
import { AbilityContext } from '../context/AbilityContext';
import { Actions, Subjects } from '@config/permissions';

// ** Defaults
const defaultProvider = {
  user: null,
  loading: false,
  resetPassowordInfo: null,
  assitSession: null,
  setResetPassowordInfo: () => null,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getPermissions: () => Promise.resolve(),
  resetPassoword: () => Promise.resolve(),
  recoveryPassword: () => Promise.resolve(),
  setAssitSession: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** Hooks
  const dispatch = useDispatch();
  const axios = useAxios();
  const navigate = useNavigate();
  const localStorage = useLocalStorage();
  const sessionStorage = useSessionStorage();
  const ability = useContext(AbilityContext);
  const location = useLocation();
  const currentPath = location.pathname;
  // ** States
  const [user, setUser] = useState(defaultProvider.user);
  const [assitSession, setAssitSession] = useState(
    defaultProvider.assitSession
  );
  const [loading, setLoading] = useState(defaultProvider.loading);
  const [resetPassowordInfo, setResetPassowordInfo] = useState(
    defaultProvider.resetPassowordInfo
  );

  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItemWithDecryption(
          authConfigTokens.accessToken
        );
        const permissionsToken = localStorage.getItemWithDecryption(
          authConfigTokens.permissions
        );
        const assistSessionToken = sessionStorage.getItemWithDecryption(
          authConfigTokens.assistSession
        );
        if (accessToken && permissionsToken) {
          //request to validate token
          axios
            .callService({ url: authUrl.validateToken })
            .post()
            .then(({ error, payload }) => {
              if (!error) {
                const { data } = payload;
                if (data && data.valid) {
                  const decodedData = parseJwt(accessToken);
                  const permissionsDecrypt = JSON.parse(
                    permissionsToken
                    /* cryptoUtil.decryptString(permissionsToken) */
                  );
                  //setear theme
                  handleSetTheme();
                  //set user data
                  handleSetUser({ ...decodedData });
                  //set assist session data
                  if (assistSessionToken) {
                    const userData = JSON.parse(assistSessionToken);
                    handleSetAssistSession(userData);
                  }
                  //setear permisos permissionsDecrypt
                  handleUpdateAbility({
                    rolename: decodedData?.roles[0],
                    permissions: permissionsDecrypt,
                  });
                  // validate current path and if the user is login and the current path is login (PAGE) redirect to main
                  if (currentPath == '/login' || currentPath == '/') {
                    const route = getRouteToRedirect(permissionsDecrypt);
                    navigate(route || '/main', { replace: true });
                  }
                } else {
                  navigate('/login', { replace: true });
                }
              } else {
                clearStorage();
                navigate('/login', { replace: true });
              }
            });
        } else {
          clearStorage();
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error(error);
        clearStorage();
        navigate('/login', { replace: true });
      }
    };
    initAuth();
  }, []);

  /* Update permissions */
  const handleUpdateAbility = ({ rolename, permissions = [] }) => {
    const { can, rules } = new AbilityBuilder(ability);

    if (rolename === 'SuperAdmin') {
      can('manage', 'all'); // read-write access to everything
      ability.update(rules);
    } else {
      ability.update([
        {
          subject: authPermissions.Subjects.MAIN_NAVIGATION, //enable main page
          action: authPermissions.Actions.MAIN,
        },
        ...permissions,
      ]);
    }
  };

  /* Set user theme */
  const handleSetTheme = (theme) => {
    if (theme) {
      localStorage.setItem('theme', theme);
    } else {
      theme = localStorage.getItem('theme');
    }
    dispatch(setTheme(theme));
  };
  /* Set user data */
  const handleSetUser = ({
    id_user,
    name,
    email,
    photo,
    roles,
    theme,
    id_context_type,
    userRecoveryPassword,
    usersToAssist,
    person,
    DPI,
    organization,
  }) =>
    setUser({
      id_user,
      id_context_type,
      name,
      email,
      photo,
      roles,
      theme,
      userRecoveryPassword,
      usersToAssist,
      person,
      DPI,
      organization,
    });

  const handleSetAssistSession = (userData) => {
    setAssitSession(userData);
    if (userData) {
      sessionStorage.setItemWithEncryption(
        authConfigTokens.assistSession,
        userData
      );
    } else {
      sessionStorage.removeItem(authConfigTokens.assistSession);
    }
  };

  const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  };

  const clearStorage = () => {
    setUser(null);
    setAssitSession(null);
    localStorage.removeItem(authConfigTokens.accessToken);
    localStorage.removeItem(authConfigTokens.refreshToken);
    localStorage.removeItem(authConfigTokens.permissions);
    sessionStorage.removeItem(authConfigTokens.assistSession);
  };

  /* Select user route */
  const getRouteToRedirect = (permissions = []) => {
    let route;
    permissions.forEach((permission) => {
      if (permission.subject == Subjects.MAIN_NAVIGATION) {
        const modules = permission.action;
        if (modules.includes(Actions.MENU_FARMACIA)) {
          route = '/main/ventas';
        } else if (modules.includes(Actions.MENU_HOSPITALARIO)) {
          route = '/main/hospitalario';
        } else {
          route = '/main/ventas';
        }
      }
    });

    return route;
  };

  const handlePermissions = ({ rolename, goToMain = false }) => {
    setLoading(true);
    axios
      .callService({ url: authUrl.permissions })
      .get({
        params: {
          rolename,
        },
      })
      .then(({ error, payload }) => {
        setLoading(false);
        if (!error) {
          const permissions = payload.data;
          localStorage.setItemWithEncryption(
            authConfigTokens.permissions,
            JSON.stringify(permissions)
          );
          // console.log({permissions}); TODO: VER PERMISOS
          //set CASL permissions
          //set permissions in Ability context
          handleUpdateAbility({ rolename, permissions: permissions });
          //set route to navigate
          let route = getRouteToRedirect(permissions);
          goToMain && navigate(route || '/main', { replace: true });
        }
      });
  };

  const handleLogin = ({ email, password }) => {
    const encryptData = cryptoUtil.encryptString({ email, password });
    setLoading(true);
    axios
      .callService({ url: authUrl.login })
      .post({ data: encryptData })
      .then(async ({ payload }) => {
        setLoading(false);
        if (payload?.data) {
          const { accessToken, refreshToken } = payload.data;
          const decodedData = parseJwt(accessToken);
          localStorage.setItemWithEncryption(
            authConfigTokens.accessToken,
            accessToken
          );
          localStorage.setItemWithEncryption(
            authConfigTokens.refreshToken,
            refreshToken
          );
          //set user data
          handleSetUser({ ...decodedData });
          //set user theme
          handleSetTheme(decodedData?.theme);
          //validate when is firt login
          if (decodedData.isFirstLogin || decodedData.userRecoveryPassword) {
            navigate('/resetpassword', { replace: true });
            return;
          }
          if (decodedData?.roles) {
            handlePermissions({
              rolename: decodedData.roles[0],
              goToMain: true,
              // route: decodedData?.defaultRoute,
            });
          }
        }
      });
  };

  const handleLogout = () => {
    clearStorage();
    handleUpdateAbility({ permissions: [] });
    navigate('/login', { replace: true });
  };

  const resetPassoword = ({ id_user, password }) => {
    const encryptBody = cryptoUtil.encryptString({ id_user, password });
    setLoading(true);
    axios
      .callService({ url: authUrl.resetPassword })
      .post({ data: encryptBody })
      .then(({ error }) => {
        setLoading(false);
        if (!error) {
          handleLogin({ email: user.email || user.DPI, password });
        }
      });
  };

  const recoveryPassword = ({ email }) => {
    setLoading(true);
    axios
      .callService({ url: authUrl.recoveryPassword })
      .post({ email })
      .then(({ error, message }) => {
        setLoading(false);
        if (!error) {
          setResetPassowordInfo({ message, severity: 'info' });
        } else {
          setResetPassowordInfo({
            message: error?.payload?.data?.message,
            severity: 'warning',
          });
        }
      });
  };
  const values = {
    user,
    loading,
    resetPassowordInfo,
    assitSession,
    setLoading,
    setUser: handleSetUser,
    login: handleLogin,
    logout: handleLogout,
    getPermissions: handlePermissions,
    resetPassoword,
    recoveryPassword,
    setResetPassowordInfo,
    setAssitSession: handleSetAssistSession,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };

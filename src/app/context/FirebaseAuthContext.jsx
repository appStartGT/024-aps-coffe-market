import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AbilityBuilder } from '@casl/ability';
import authConfigTokens from '@config/authConfig/tokens';
import { authUrl } from '@config/endpointConfig';
import { useAxios, useSessionStorage } from '@hooks';
import { cryptoUtil, permissions as authPermissions } from '@utils';
import { AbilityContext } from '../context/AbilityContext';
import Firebase from '@config/firebaseConfig';
import { loginUser } from '@utils/firebaseMethods';
import { boolean } from 'yup';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { firestore } from '@config/firebaseConfig';
import { firebaseCollections } from '@utils';

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
  resetPassoword: () => Promise.resolve(),
  recoveryPassword: () => Promise.resolve(),
  setAssitSession: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** Hooks
  const axios = useAxios();
  const navigate = useNavigate();
  const sessionStorage = useSessionStorage();
  const ability = useContext(AbilityContext);

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
    const unsubscribe = Firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        handleLogout();
      } else {
        const userToken = sessionStorage.getItemWithDecryption(
          authConfigTokens.user
        );
        if (!boolean(userToken)) handleLogout();
        const userData = JSON.parse(userToken);
        handleSetUser({ ...userData });
        //set permissions from user
        handleUpdateAbility({
          rolename: userData?.role?.name,
          permissions: userData?.permissions,
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [Firebase]);

  /* Validate multi sessions for same user */
  useEffect(() => {
    if (!user || !user?.id_user) return;
    const userSessionsQuery = query(
      collection(firestore, firebaseCollections.USER_SESSIONS),
      where('isActive', '==', true),
      where('user', '==', user.id_user)
    );

    const firestoreUnsubscribe = onSnapshot(
      userSessionsQuery,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const session = change.doc.data();
            // Check if the session ID is different
            if (user.sessionId !== session.sessionId) {
              handleLogout();
            }
          }
        });
      },
      (error) => {
        console.error('Error subscribing to collection: ', error);
      }
    );

    return () => firestoreUnsubscribe();
  }, [user]);

  /* Update permissions */
  function handleUpdateAbility({ rolename, permissions = [] }) {
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
  }

  /* Set user data */
  const handleSetUser = (data) => {
    const {
      branch,
      DPI,
      email,
      id_branch,
      id_organization,
      id_role,
      id_user,
      inventory,
      names,
      organization,
      permissions,
      photo,
      role,
      surNames,
      theme,
      userRecoveryPassword,
      sessionId,
    } = data;

    setUser({
      branch,
      DPI,
      email,
      id_branch: id_branch,
      id_inventory: inventory?.id_inventory || null,
      id_organization: branch?.organization?.id_organization || id_organization,
      id_role,
      id_user,
      name: `${names} ${surNames}`,
      permissions: permissions || [],
      photo,
      role: role?.name,
      theme,
      userRecoveryPassword,
      organization: branch?.organization || organization,
      sessionId,
    });
  };

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

  const clearStorage = () => {
    setUser(null);
    setAssitSession(null);
    sessionStorage.removeItem(authConfigTokens.assistSession);
    sessionStorage.removeItem(authConfigTokens.user);
  };

  const handleLogin = ({ email, password }) => {
    setLoading(true);
    loginUser(email, password).then((data) => {
      setLoading(false);
      if (data) {
        sessionStorage.setItemWithEncryption(authConfigTokens.user, data);
        handleSetUser(data);
        handleUpdateAbility({
          rolename: data?.role?.name,
          permissions: data?.permissions,
        });
        navigate('/main', { replace: true });
      }
    });
  };

  function handleLogout() {
    Firebase.auth()
      .signOut()
      .then(() => {
        clearStorage();
        navigate('/login', { replace: true });
      });
  }

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
    resetPassoword,
    recoveryPassword,
    setResetPassowordInfo,
    setAssitSession: handleSetAssistSession,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };

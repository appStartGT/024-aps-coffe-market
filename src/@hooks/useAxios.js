import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLocalStorage, useSessionStorage } from '@hooks';
import tokens from '@config/authConfig/tokens';
import { authUrl } from '@config/endpointConfig';
import authConfigTokens from '@config/authConfig/tokens';
import { cryptoUtil } from '@utils';

const useAxios = () => {
  const { getItemWithDecryption, setItemWithEncryption, getItem } =
    useLocalStorage();
  const assistSessionToken = useSessionStorage().getItemWithDecryption(
    authConfigTokens.assistSession
  );

  const userAssistant = assistSessionToken
    ? JSON.parse(assistSessionToken)
    : null;

  // set request config
  axios.interceptors.request.use(
    async (config) => {
      const accessToken = getItemWithDecryption(tokens.accessToken);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      if (userAssistant) {
        config.headers['assistance-to-user'] = userAssistant.id_user;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // set response config
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      let originalRequest = error.config;
      if (error.response?.status === 409 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = getItem(tokens.refreshToken);
        try {
          const response = await axios.post(authUrl.newAccessToken, {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          });
          const decryptedTokens = JSON.parse(
            cryptoUtil.decryptString(response.data?.payload?.data)
          );
          const { accessToken, refreshToken: newRefreshToken } =
            decryptedTokens;
          setItemWithEncryption(tokens.accessToken, accessToken);
          setItemWithEncryption(tokens.refreshToken, newRefreshToken);

          return axios({
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${accessToken}`,
            },
            sent: true,
          });
        } catch (err) {
          //try it three times
          if (originalRequest.retryCount < 2) {
            originalRequest.retryCount = (originalRequest.retryCount || 0) + 1;
            return axios(originalRequest);
          }
          console.error('Error trying renew token', err);
          return Promise.reject(error);
        }
      }
      //must be login
      if (error.response?.status === 401) {
        window.sessionStorage.clear();
        window.localStorage.clear();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  const getErrorMessage = (err) => {
    //PARAMS ERROR
    if (err?.response?.data?.payload?.data?.status == 411) {
      const realData = err.response.data.payload.data;
      return realData.message + ' ' + realData.stack;
    }
    //CONTROLED ERROR
    else if (err?.response?.data?.payload?.data?.status == 404) {
      const realData = err.response.data.payload.data;
      return realData.message; /* + ' ' + realData.stack; */
    }
    //DEFAULT
    else if (err?.response?.data?.payload?.data.message) {
      return err?.response?.data?.payload?.data.message;
    } else {
      return 'Technical error';
    }
  };

  const sendRequest = async (
    axiosCallback,
    errorCallback,
    toastOptions = {}
  ) => {
    toastOptions = { showSucces: true, showError: true, ...toastOptions }; //set default cofig
    const toastProps = {
      position: 'bottom-right',
      style: { marginBottom: '50px', marginRight: '50px' },
      duration: 5000,
    };

    try {
      const response = await axiosCallback();
      if (toastOptions.showSucces) {
        const message = response.data?.message;
        message && toast.success(message, toastProps);
      }
      return response.data;
    } catch (err) {
      console.error(err);
      /* Validate message error */
      if (toastOptions.showError) {
        let message = getErrorMessage(err);
        message && toast.error(message, toastProps);
      }
      const error = err?.response?.data || err?.response || err?.message;
      return errorCallback ? errorCallback(error) : { error };
    }
  };

  const callService = ({ url, errorCallback, toastOptions }) => {
    return {
      get: async (config = {}) => {
        const request = async () => await axios.get(url, config);
        return await sendRequest(request, errorCallback, toastOptions);
      },
      post: async (data = {}, config = {}) => {
        const request = async () => await axios.post(url, data, config);
        return await sendRequest(request, errorCallback, toastOptions);
      },
      put: async (data = {}) => {
        const request = async () => await axios.put(url, data);
        return await sendRequest(request, errorCallback, toastOptions);
      },
      delete: async (data = {}) => {
        const request = async () => await axios.delete(url, data);
        return await sendRequest(request, errorCallback, toastOptions);
      },
    };
  };

  return { callService };
};

export default useAxios;

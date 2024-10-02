import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import tokens from '@config/authConfig/tokens';
import useLocalStorage from './useLocalStorage';

const useSocketio = () => {
  const { getItemWithDecryption } = useLocalStorage();
  const [socket, setSocket] = useState(null);
  const accessToken = getItemWithDecryption(tokens.accessToken);
  const SOCKET_SERVER = import.meta.env.REACT_APP_SOCKET;

  useEffect(
    () => {
      if (socket) return;

      const socketIo = io(SOCKET_SERVER, {
        auth: {
          accessToken,
        },
      });

      socketIo.on('connect', () => {
        console.log('Connected to Socket.io server');
        socketIo.emit('user_connected', '1');
      });

      socketIo.on('disconnect', () => {
        console.log('Disconnected from Socket.io server');
      });

      socketIo.on('reconnect', (attemptNumber) => {
        console.log(
          `Reconnected to Socket.io server (attempt ${attemptNumber})`
        );
      });

      socketIo.on('reconnect_error', (error) => {
        console.log('Reconnect error:', error);
      });

      setSocket(socketIo);

      return () => {
        // Before the component unmounts, disconnect the socket
        socketIo.off('connect');
        socketIo.off('disconnect');
        socketIo.off('reconnect');
        socketIo.off('reconnect_error');
        socketIo.disconnect();
      };
    },
    [
      /* SOCKET_SERVER, token */
    ]
  ); // If these values change, re-run the effect

  return socket;
};

export default useSocketio;

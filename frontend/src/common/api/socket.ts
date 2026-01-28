import { io } from 'socket.io-client';

const socketUrl =
  import.meta.env.VITE_BACKEND_URL ??
  (import.meta.env.MODE === 'production'
    ? window.location.origin
    : 'http://localhost:3000');

export const socket = io(`${socketUrl}/workspace`, {
  transports: ['polling', 'websocket'],
});

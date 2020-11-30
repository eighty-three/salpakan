import ky from 'ky-universal';
import HOST from '@/lib/host';
const api = `${HOST}/api/game`;

import ws from 'ws';
const WS = global.WebSocket || ws;

export const connectToGame = (id, setBoard) => {
  let socket = new WS(`ws://localhost:8500/game/${id}`);

  socket.onopen = () => {
    console.log('hello');
  };

  socket.onmessage = (message) => {
    const data = message.data;
    setBoard(data);
  };

  socket.onerror = () => {
    console.log('no room');
  };
};

export const getGame = async (id) => {
  try {
    const req = ky.get(`${api}/${id}`);
    const response = await req.json();
    return response;
  } catch (err) {
    return { error: 'Something went wrong' };
  }
};

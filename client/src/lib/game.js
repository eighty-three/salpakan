import ky from 'ky-universal';
import HOST from '@/lib/host';
const api = `${HOST}/api/game`;

import ws from 'ws';
const WS = global.WebSocket || ws;

export const connectToGame = (url) => { // Fix this
  let socket = new WS(`ws://localhost:8500/game/${url}`);

  socket.onopen = () => {
    console.log('hello');
  };

  socket.onmessage = (message) => {
    const data = message.data;
    console.log(data);
  };

  socket.onerror = () => {
    console.log('no room');
  };
};

export const getGame = async (url) => {
  try {
    const req = ky.get(`${api}/${url}`);
    const response = await req.json();
    return response;
  } catch (err) {
    return { error: 'Something went wrong' };
  }
};

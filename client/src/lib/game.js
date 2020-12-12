import ky from 'ky-universal';
import HOST from '@/lib/host';
const api = `${HOST}/api/game`;

import ws from 'ws';
const WS = global.WebSocket || ws;

export const connectToGame = (id, setGameInfo, setUser) => {
  let socket = new WS(`ws://localhost:8500/game/${id}`);

  socket.onopen = () => {
    console.log('hello');
  };

  socket.onmessage = (message) => {
    const res = JSON.parse(message.data);
    switch (res.type) {
      case 'init':
        setGameInfo(res.data);
        setUser(res.user);
        break;

      case 'start':
        setGameInfo(res.data);
        break;

      case 'move':
        setGameInfo(res.data);
        break;
    }
  };

  socket.onclose = () => {
    setGameInfo(null);
  };

  socket.onerror = () => {
    console.log('no room');
  };

  return socket;
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

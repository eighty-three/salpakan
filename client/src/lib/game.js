import ky from 'ky-universal';
import HOST from '@/lib/host';
const api = `${HOST}/api/game`;

import ws from 'ws';
const WS = global.WebSocket || ws;

export const connectToGame = (id, setBoard, setGameInfo, setTime) => {
  let socket = new WS(`ws://localhost:8500/game/${id}`);

  socket.onopen = () => {
    console.log('hello');
  };

  socket.onmessage = (message) => {
    const res = JSON.parse(message.data);
    switch (res.type) {
      case 'init':
        setBoard(res.data.gameState);
        setGameInfo(res.data);
        setTime(res.data.time - Math.floor(Date.now() / 100));
        // Data from server is deciseconds so deduct in deciseconds
        break;
    }
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

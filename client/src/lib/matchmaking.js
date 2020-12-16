import Router from 'next/router';
import { WS_HOST } from '@/lib/host';
import ws from 'ws';
const WS = global.WebSocket || ws;

export const findMatch = (button) => {
  let socket = new WS(`${WS_HOST}/ws/matchmaking`);

  socket.onopen = () => {
    button({ disabled: true, text: 'Finding...' });
  };

  socket.onmessage = (message) => {
    const data = message.data;
    socket.close();
    Router.push(`/game/${data}`);
  };

  socket.onerror = () => {
    button({ disabled: true , text: 'Please try again' });
  };
};

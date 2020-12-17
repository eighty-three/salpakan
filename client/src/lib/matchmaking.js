import Router from 'next/router';
import { WS_HOST } from '@/lib/host';
import ws from 'ws';
const WS = global.WebSocket || ws;

export const findMatch = (button) => {
  let socket = new WS(`${WS_HOST}/ws/matchmaking`);

  socket.onmessage = (message) => {
    const data = message.data;
    socket.close();
    button({ disabled: true, text: 'Match found!' });
    Router.push(`/game/${data}`);
  };

  socket.onerror = () => {
    button({ disabled: true , text: 'Please try again' });
  };
};

import Router from 'next/router';
import ws from 'ws';
const WS = global.WebSocket || ws;

export const findMatch = (button) => {
  let socket = new WS('ws://localhost:8500/matchmaking');

  socket.onopen = () => {
    button({ disabled: true, text: 'Finding...' });
  };

  socket.onmessage = (message) => {
    const data = message.data;
    Router.push(`/game/${data}`);
  };

  socket.onerror = () => {
    button({ disabled: true , text: 'Please try again' });
  };
};

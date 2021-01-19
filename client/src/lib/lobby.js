import Router from 'next/router';
import ky from 'ky-universal';
import { HOST, WS_HOST } from '@/lib/host';
const api = `${HOST}/api/lobby`;

import ws from 'ws';
const WS = global.WebSocket || ws;

export const getLobby = async (id) => {
  try {
    const req = ky.get(`${api}/${id}`);
    const response = await req.json();
    return (!response.error) ? true : null;
  } catch (err) {
    return null;
  }
};

export const createLobby = async (button) => {
  try {
    const req = ky.get(`${api}/create`);
    const response = await req.json();

    if (!response.error) {
      Router.push(`/lobby/${response.roomName}`);
    } else {
      button({ disabled: true, text: 'Something went wrong' });
    }
  } catch (err) {
    button({ disabled: true, text: 'Something went wrong' });
  }
};

export const connectToLobby = async (id, setText) => {
  let socket = new WS(`${WS_HOST}/ws/lobby/${id}`);

  socket.onmessage = (message) => {
    setText('Redirecting...');
    socket.close();

    const data = message.data;

    Router.push(`/game/${data}`);
  };
};

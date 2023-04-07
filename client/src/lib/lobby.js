import Router from 'next/router';
import ky from 'ky-universal';
import { HOST, WS_HOST } from '@/lib/host';
const api = `${HOST}/api/lobby`;

export const WSLOBBY_URL = `${WS_HOST}/ws/lobby`;

export const getLobby = async (id) => {
  try {
    const req = ky.get(`${api}/${id}`);
    const response = await req.json();
    return (!response.error) ? true : null;
  } catch (err) {
    return null;
  }
};

export const createLobby = async () => {
  try {
    const req = ky.get(`${api}/create`);
    const response = await req.json();

    if (response.error) {
      return response;
    } else {
      Router.push(`/lobby/${response.roomName}`);
    }
  } catch (err) {
    return { error: 'Something went wrong' };
  }
};

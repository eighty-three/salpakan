export const HOST = (process.env.NODE_ENV !== 'production')
  ? `http://localhost:${process.env.PORT}`
  : `https://${process.env.HOST}`;

export const WS_HOST = (process.env.NODE_ENV !== 'production')
  ? `ws://localhost:${process.env.WS_PORT}`
  : `wss://${process.env.HOST}`;

const HOST = (process.env.NODE_ENV !== 'production')
  ? `http://localhost:${process.env.PORT}`
  : process.env.HOST;

export default HOST;

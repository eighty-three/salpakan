import { StringDecoder } from 'string_decoder';
const decoder = new StringDecoder('utf8');

export const decode = (buf: ArrayBuffer) => decoder.write(Buffer.from(buf));

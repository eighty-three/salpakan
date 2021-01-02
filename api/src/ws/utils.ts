import { StringDecoder } from 'string_decoder';
const decoder = new StringDecoder('utf8');

export const decode = (buf: ArrayBuffer): string => decoder.write(Buffer.from(buf));

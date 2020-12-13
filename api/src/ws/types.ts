import {
  HttpResponse,
  HttpRequest,
  us_listen_socket,
  WebSocket
} from 'uWebSockets.js';

export interface IUpgrade<T> {
  (
    res: HttpResponse,
    req: HttpRequest,
    context: us_listen_socket
  ): T
}

export interface IOpen<T> {
  (socket: WebSocket): T
}
export interface IClose<T> {
  (socket: WebSocket): T
}

export interface IMessage<T> {
  (
    socket: WebSocket,
    message: ArrayBuffer
  ): T
}

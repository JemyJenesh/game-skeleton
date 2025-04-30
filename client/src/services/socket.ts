import { io, Socket as SocketClient } from "socket.io-client";

import {
  SocketClientEvents,
  SocketEventHandler,
  SocketServerEvents,
} from "typings";

class SocketService {
  static client: SocketClient;

  constructor() {
    if (!SocketService.client) {
      const wsUrl =
        process.env.NODE_ENV === "production" ? "" : "http://localhost:3001";
      SocketService.client = io(wsUrl);
    }
  }

  async emit<Payload extends unknown>(
    event: SocketClientEvents,
    data: Payload
  ) {
    SocketService.client.emit(event, data);
  }

  on<ReceivedData extends unknown>(
    event: SocketServerEvents,
    handler: SocketEventHandler<ReceivedData>
  ) {
    SocketService.client.on(event, (data: ReceivedData) => {
      try {
        handler(data);
      } catch (error) {
        console.error("SocketService.on: ", error);
      }
    });
  }

  disconnect() {
    SocketService.client.disconnect();
  }
}

export default new SocketService();

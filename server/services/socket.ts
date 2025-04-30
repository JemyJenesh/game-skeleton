import { Socket } from "socket.io";
import {
  SocketClientEvents,
  SocketEventHandler,
  SocketServerEvents,
} from "typings/Socket";

class SocketService {
  private client: Socket;

  constructor(_client: Socket) {
    this.client = _client;
  }

  setupListeners(id: string) {
    this.client.join(id);
  }

  async emit<Payload extends unknown>(
    roomId: string,
    event: SocketServerEvents,
    data: Payload
  ) {
    this.client.nsp.to(roomId).emit(event, data, (error: string) => {
      if (error) {
        console.error("SocketService.emit: ", error);
      }
    });
  }

  on<ReceivedData extends unknown>(
    event: SocketClientEvents,
    handler: SocketEventHandler<ReceivedData>
  ) {
    this.client.on(event, async (data: ReceivedData) => {
      try {
        handler(data);
      } catch (error) {
        console.error("SocketService.on: ", error);
      }
    });
  }
}

export default SocketService;

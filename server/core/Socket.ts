import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

class Socket {
  static io: SocketServer;

  static async boot(http: HttpServer) {
    Socket.setupSocket(http);
    Socket.setupListeners();
  }

  static setupSocket(http: HttpServer) {
    this.io = new SocketServer(http, {
      cors: {
        origin:
          process.env.NODE_ENV === "production" ? "" : "http://localhost:3000",
      },
    });
  }

  private static setupListeners() {
    this.io.on("connection", (client) => {
      client.on("order-serve-card", (unoId) => {
        client.emit(`serve-card_${unoId}`);
      });
    });
  }
}

export default Socket;

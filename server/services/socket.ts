import { Server as NodeServer } from "node:http";
import { Server } from "socket.io";

let serverSocket: Server;

export function initSocket(server: NodeServer) {
  const io = new Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production" ? "" : "http://localhost:3000",
    },
  });
  serverSocket = io;
}

export function getServerSocket() {
  if (!serverSocket) {
    throw new Error(
      "Must call module constructor function before you can get the serverSocket instance"
    );
  }
  return serverSocket;
}

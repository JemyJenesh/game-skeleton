import { io } from "socket.io-client";

const wsUrl =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3001";
export const socket = io(wsUrl);

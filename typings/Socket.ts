export type SocketServerEvents = "PlayerJoined";
export type SocketClientEvents = "ConnectPlayer" | "JoinGame";
export type SocketEventHandler<ReceivedData extends unknown> = (
  data: ReceivedData
) => void;

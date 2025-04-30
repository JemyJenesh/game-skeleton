import BingoService from "server/services/bingos";
import SocketService from "server/services/socket";
import { Socket } from "socket.io";
import { Player } from "typings/Player";

class EventHandlerModule {
  onConnection(client: Socket) {
    try {
      client.on("order-serve-card", (unoId) => {
        client.emit(`serve-card_${unoId}`);
      });
      const socket = new SocketService(client);
      socket.on<{ gameId: string }>("ConnectPlayer", ({ gameId }) => {
        socket.setupListeners(gameId);
      });
      socket.on<{ player: Player; gameId: string }>(
        "JoinGame",
        async ({ player, gameId }) => {
          const bingo = await BingoService.addPlayer(gameId, player);
          if (bingo) {
            socket.emit(gameId, "PlayerJoined", bingo);
          }
        }
      );
    } catch (err) {
      console.log("Event Handler Error: ", err);
    }
  }
}

export default new EventHandlerModule();

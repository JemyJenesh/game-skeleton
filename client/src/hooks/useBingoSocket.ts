import { queryClient } from "client/App";
import SocketService from "client/services/socket";
import { useEffect } from "react";
import { Bingo } from "typings/Bingo";
import { Player } from "typings/Player";
import { usePlayer } from "./player";

export default function useBingoSocket({ id }: { id: string }) {
  const queryKey = ["bingos", id];
  const { player } = usePlayer();
  const updateBingo = (bingo: Bingo) => {
    queryClient.setQueryData(queryKey, bingo);
  };

  const setupListeners = () => {
    connectPlayer();
    listenPlayerJoined();
  };
  const connectPlayer = () => {
    if (player && id) {
      SocketService.emit<{ gameId: string }>("ConnectPlayer", {
        gameId: id,
      });
    }
  };
  const listenPlayerJoined = () => {
    SocketService.on<Bingo>("PlayerJoined", (bingo) => {
      console.log("PlayerJoined", bingo);
      updateBingo(bingo);
    });
  };
  const joinGame = () => {
    if (player && id) {
      SocketService.emit<{ player: Player; gameId: string }>("JoinGame", {
        player,
        gameId: id,
      });
    }
  };

  useEffect(() => {
    if (player && id) {
      setupListeners();
    }

    return () => SocketService.disconnect();
  }, []);

  return { setupListeners, joinGame };
}

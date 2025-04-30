import { BingoPlayer, Player } from "./Player";

export type Bingo = {
  _id: string;
  players: BingoPlayer[];
  winner: Player | null;
  history: string[];
  state: "waiting" | "playing" | "over";
};

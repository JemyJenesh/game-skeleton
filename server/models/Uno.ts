import { Schema, Types, model } from "mongoose";

type IUno = {
  players: Types.ObjectId[];
  winner: Types.ObjectId;
  state: "waiting" | "serving" | "playing" | "over";
};

export type UnoCreateInput = {
  playerId: Types.ObjectId;
};

const UnoSchema = new Schema<IUno>({
  players: [{ type: Schema.Types.ObjectId, ref: "Player" }],
  winner: { type: Schema.Types.ObjectId, ref: "Player" },
  state: { type: String, default: "waiting" },
});

export const Uno = model<IUno>("Uno", UnoSchema);

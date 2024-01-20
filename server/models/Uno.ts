import { Schema, Types, model } from "mongoose";

export const UNO_COLORS = [
  "red",
  "yellow",
  "blue",
  "green",
  // "wild"
] as const;
export const UNO_VALUES = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  // "draw-two",
  // "skip",
  // "reverse",
  // "wild",
  // "wild-four",
] as const;

export type UnoColor = (typeof UNO_COLORS)[number];
export type UnoValue = (typeof UNO_VALUES)[number];
export type UnoCard = {
  color: UnoColor;
  value: UnoValue;
  name: string;
};
export type IUno = {
  deck: UnoCard[];
  pile: UnoCard[];
  hands: UnoCard[][];
  turn: number;
  direction: -1 | 1;
  state: "waiting" | "serving" | "playing" | "over";
  winner: Types.ObjectId;
  players: Types.ObjectId[];
};
export type UnoCreateInput = {
  playerId: Types.ObjectId;
};
export type UnoUpdateInput = Partial<IUno>;

const UnoCardSchema = {
  color: { type: String },
  value: { type: String },
  name: { type: String },
};

const UnoSchema = new Schema<IUno>({
  deck: [UnoCardSchema],
  pile: [UnoCardSchema],
  hands: [[UnoCardSchema]],
  turn: { type: Number, default: 0 },
  direction: { type: Number, default: 1 },
  state: { type: String, default: "waiting" },
  winner: { type: Schema.Types.ObjectId, ref: "Player" },
  players: [{ type: Schema.Types.ObjectId, ref: "Player" }],
});

export const Uno = model<IUno>("Uno", UnoSchema);

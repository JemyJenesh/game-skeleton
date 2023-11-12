import { Schema, model } from "mongoose";

type IPlayer = {
  name: string;
  avatar: string;
  tag: "creator" | "player";
  wins: number;
  played: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type PlayerInput = {
  name: string;
  avatar: string;
};

const PlayerSchema = new Schema<IPlayer>({
  name: { type: String, required: true },
  avatar: { type: String },
  tag: { type: String, default: "player" },
  wins: { type: Number, default: 0 },
  played: { type: Number, default: 0 },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

export const Player = model<IPlayer>("Player", PlayerSchema);

import { Schema, model } from "mongoose";
import { Player as IPlayer } from "typings";

const PlayerSchema = new Schema<IPlayer>({
  name: { type: String, required: true },
  avatar: { type: String },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

export const Player = model<IPlayer>("Player", PlayerSchema);

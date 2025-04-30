import { PlayerInput } from "typings";
import { Player } from "../models";

export const PlayerRepository = {
  async findById(id: string) {
    return await Player.findById(id).lean();
  },

  async create(playerInput: PlayerInput) {
    return await Player.create(playerInput);
  },

  async update(id: string, playerInput: PlayerInput) {
    return await Player.findByIdAndUpdate(id, playerInput, { new: true });
  },
};

import { Uno } from "../models";

export const UnoService = {
  async findById(id: string) {
    return await Uno.findById(id).populate("players");
  },

  async create(playerId: string) {
    return await Uno.create({
      players: [playerId],
    });
  },

  async join(id: string, playerId: string) {
    return await Uno.findByIdAndUpdate(
      id,
      {
        $push: { players: playerId },
      },
      { new: true }
    );
  },
};

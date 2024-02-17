import { Types } from "mongoose";

export type Player = {
  _id: Types.ObjectId;
  name: string;
  avatar: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type PlayerInput = {
  name: string;
  avatar: string;
};

export type Player = {
  _id: string;
  name: string;
  avatar: string;
  tag: "creator" | "player";
  wins: number;
  played: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

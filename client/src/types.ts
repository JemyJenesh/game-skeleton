export type Player = {
  name: string;
  avatar: string;
  tag: "creator" | "player";
  wins: number;
  played: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

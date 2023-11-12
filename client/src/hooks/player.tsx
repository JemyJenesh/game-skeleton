import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "../types";

type ContextProps = {
  player: Player | null;
  loading: boolean;
  setPlayer: (player: Player) => void;
  fetchPlayer: () => Promise<void>;
};
const PlayerContext = createContext<ContextProps>({
  player: null,
  loading: true,
  setPlayer: () => null,
  fetchPlayer: async () => {},
});

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchPlayer = async () => {
    setLoading(true);

    fetch("/api/players/me")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data) {
          navigate("/players/create");
        }
        setPlayer(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <PlayerContext.Provider value={{ player, loading, setPlayer, fetchPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const { player, loading, setPlayer, fetchPlayer } = useContext(PlayerContext);

  return { player, loading, setPlayer, fetchPlayer };
}

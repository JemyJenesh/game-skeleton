import {
  Bingo,
  BingoRoom,
  Home,
  NotFoundPage,
  PlayerCreate,
  PlayerEdit,
  PlayerView,
  TypingPractice,
  Uno,
  UnoRoom,
} from "client/pages";
import React from "react";
import { Route, Routes } from "react-router-dom";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/players/create" element={<PlayerCreate />} />
      <Route path="/players/edit" element={<PlayerEdit />} />
      <Route path="/players/me" element={<PlayerView />} />
      <Route path="/typing" element={<TypingPractice />} />
      <Route path="/unos/:id" element={<Uno />} />
      <Route path="/unos/:id/room" element={<UnoRoom />} />
      <Route path="/bingos/:id" element={<Bingo />} />
      <Route path="/bingos/:id/room" element={<BingoRoom />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

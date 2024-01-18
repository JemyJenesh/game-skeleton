import express from "express";
import { playersRouter } from "./players";
import { unosRouter } from "./unos";

export const router = express.Router();

router.get("/status", (req, res) => {
  res.json({ ok: true });
});

router.use("/players", playersRouter);
router.use("/unos", unosRouter);

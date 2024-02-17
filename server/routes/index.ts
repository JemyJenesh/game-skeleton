import express from "express";
import { playersRouter } from "./players";
import { unosRouter } from "./unos";

export const router = express.Router();

router.use("/players", playersRouter);
router.use("/unos", unosRouter);

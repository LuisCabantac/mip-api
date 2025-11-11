import { Router } from "express";

import { authenticateToken } from "../lib/token";
import {
  createHistory,
  deleteHistory,
  getHistories,
  getHistory,
} from "../controllers/historyController";

const router = Router();

router.use(authenticateToken);

router.get("/single/:historyId", getHistory);

router.delete("/", deleteHistory);

router.post("/", createHistory);

router.get("/", getHistories);

export default router;

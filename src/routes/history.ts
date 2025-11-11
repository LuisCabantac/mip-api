import { Router } from "express";

import { authenticateToken } from "../lib/token";
import {
  createHistory,
  deleteHistory,
  getAllHistory,
  getHistory,
} from "../controllers/historyController";

const router = Router();

router.use(authenticateToken);

router.get("/single/:historyId", getHistory);

router.delete("/", deleteHistory);

router.post("/", createHistory);

router.get("/", getAllHistory);

export default router;

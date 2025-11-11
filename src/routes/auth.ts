import { Router, Request, Response, NextFunction } from "express";

import { signIn } from "../controllers/authController";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await signIn(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;

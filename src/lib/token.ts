import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";

import { AuthenticatedRequest, JwtPayload } from "../types/token";

export function generateToken(payload: { id: string; email: string }): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    return payload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export function extractTokenFromHeader(
  authHeader: string | undefined
): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        message: "Access denied. No token provided.",
        error: "Unauthorized",
        statusCode: 401,
      });
      return;
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      message: error instanceof Error ? error.message : "Invalid token",
      error: "Unauthorized",
      statusCode: 401,
    });
  }
}

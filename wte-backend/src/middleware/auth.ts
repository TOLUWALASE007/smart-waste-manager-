import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Invalid token" });

  // attach user info to request
  (req as any).userId = payload.userId;
  next();
}

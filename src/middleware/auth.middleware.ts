import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { UnAuthorizedException } from "../common";
import { JWT_ACCESS_SECRET } from "../config";
import { redisClient } from "../DB/redis.connect";
import { User } from "../DB/models/user/user.model";

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return next(new UnAuthorizedException("Token is required"));
    }

    const token = authorization.startsWith("Bearer ")
      ? (authorization.split(" ")[1] ?? "")
      : authorization;

    // Check if token is blacklisted in Redis
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return next(new UnAuthorizedException("Token has been revoked"));
    }

    const decoded = jwt.verify(
      token,
      JWT_ACCESS_SECRET,
    ) as JwtPayload;

    const user = await User.findById(decoded["userId"]);
    if (!user) {
      return next(new UnAuthorizedException("User not found"));
    }

    req.user = user.toObject();
    req.token = token ?? "";

    next();
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return next(new UnAuthorizedException("Token expired"));
    }
    return next(new UnAuthorizedException("Invalid token"));
  }
};

export default isAuthenticated;

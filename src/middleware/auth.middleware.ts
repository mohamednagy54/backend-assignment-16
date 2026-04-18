import type { NextFunction, Request, Response } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // get authorization from req
  // check token
  // check user into db
  // inject user into req
};

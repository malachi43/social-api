import { Request, Response, NextFunction } from "express";
import UnauthenticatedError from "../errors/unauthenticated.error.js";

interface ICustomRequest extends Request {
  user: string;
  session: { isLoggedIn: boolean };
}

async function isAuthenticated(
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) {
  if (req.session.isLoggedIn) {
    next();
  } else {
    throw new UnauthenticatedError(`Unauthorized. Please login.`);
  }
}

export default isAuthenticated;

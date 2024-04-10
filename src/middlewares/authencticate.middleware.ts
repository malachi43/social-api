import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import BadRequest from "../errors/badRequest.error.js";

interface ICustomRequest extends Request {
  user: string;
}

async function isAuthenticated(
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) {
  const bearerToken = req.headers["authorization"];
  if (!bearerToken) {
    throw new BadRequest(`please provide an authentication token, with the signature Bearer <token>`);
  }
  const token = bearerToken.split(" ")[1];
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedToken;
    console.log(`verifiedToken: `, verifiedToken);
    next();
  } catch (error) {
    throw new BadRequest(`please provide a valid token`);
  }
}

export default isAuthenticated;

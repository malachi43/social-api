import { Request, Response, NextFunction } from "express";
import pkg from "http-status-codes";
const { StatusCodes } = pkg;

function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(StatusCodes.NOT_FOUND).send(`<h3>PAGE NOT FOUND</h3>`);
}

export default notFound;

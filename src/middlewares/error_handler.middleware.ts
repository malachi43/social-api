import { Request, Response, NextFunction } from "express";

  interface ICustomError extends Error {
      statusCode: number
  }

function errorHandler(err: ICustomError, req: Request, res: Response, next: NextFunction) {
  const obj = {
    msg: err.message || "INTERNAL SERVER ERROR",
    errorCode: err.statusCode || 500,
  };

  res.status(obj.errorCode).json({ success: false, msg: err.message });
}

export default errorHandler

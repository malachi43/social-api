import { Request, Response, NextFunction } from "express";

//NOTE: The callback passed to this function("asyncWrapper") should be a callback that returns a promise.
function asyncWrapper(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

export default asyncWrapper;

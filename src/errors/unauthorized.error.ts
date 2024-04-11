import pkg from "http-status-codes";
const { StatusCodes } = pkg;

class UnauthorizedError extends Error {
  msg: string;
  statusCode: number;
  constructor(msg: string) {
    super(msg);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default UnauthorizedError;

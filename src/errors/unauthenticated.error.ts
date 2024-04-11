import pkg from "http-status-codes";
const { StatusCodes } = pkg;

class UnauthenticatedError extends Error {
  msg: string;
  statusCode: number;
  constructor(msg: string) {
    super(msg);
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

export default UnauthenticatedError

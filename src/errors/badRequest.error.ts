import pkg from "http-status-codes";
const { StatusCodes } = pkg;

class BadRequest extends Error {
  msg: string;
  statusCode: number;
  constructor(msg: string) {
    super(msg);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequest;

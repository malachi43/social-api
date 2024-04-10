import userService from "../services/user.service.js";
import { Request, Response } from "express";
import pkg from "http-status-codes";
const { StatusCodes } = pkg;

class UserController {
  async register(req: Request, res: Response) {
    const registerdUser = await userService.register(req.body);
    res.status(StatusCodes.OK).json({ data: registerdUser });
  }

  async login(req: Request, res: Response) {
    const loggedInUser = await userService.login(req.body);
    res.status(StatusCodes.OK).json({ data: loggedInUser });
  }

  async follow(req: Request, res: Response) {
    const { userId, id } = req.params;
    const user = await userService.follow(userId, id);
    res.status(StatusCodes.OK).json({ data: user });
  }
}

export default new UserController();

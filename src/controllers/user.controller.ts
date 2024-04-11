import userService from "../services/user.service.js";
import { Request, Response } from "express";
import pkg from "http-status-codes";
const { StatusCodes } = pkg;
interface ICustomRequest extends Request {
  session: { user: {}; isLoggedIn: boolean };
}
class UserController {
  async register(req: Request, res: Response) {
    console.log(req.body);
    const registereddUser = await userService.register(req.body);
    res.status(StatusCodes.OK).json({
      data: {
        user: {
          id: registereddUser._id.toString(),
          email: registereddUser.email,
          username: registereddUser.username,
        },
      },
    });
  }

  async login(req: ICustomRequest, res: Response) {
    const { user } = await userService.login(req.body);

    //create session for logged in user.
    req.session.isLoggedIn = true;
    req.session.user = { id: user._id.toString(), email: user.email };
    res.status(StatusCodes.OK).json({
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
        },
      },
    });
  }

  async follow(req: Request, res: Response) {
    const { userId, id } = req.params;
    const user = await userService.follow(userId, id);
    res.status(StatusCodes.OK).json({ data: user});
  }
}

export default new UserController();

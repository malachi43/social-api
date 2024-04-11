import { HydratedDocument, Model } from "mongoose";
import conn from "../database/database.js";
import BadRequest from "../errors/badRequest.error.js";
import pkg from "jsonwebtoken";
const { sign } = pkg;

// interface IUser {
//   username?: string;
//   email: string;
//   password: string;
//   followers?: {};
//   following?: {};
//   comparePassword(field: string): boolean;
// }

// interface IUserMethods {
//   comparePassword(field: string): boolean;
// }
// Model<IUser, {}, IUserMethods>

class UserService {
  #_User: any;
  constructor() {
    this.#_User = conn.model("User");
  }

  //register a user
  async register({ username, email, password }) {
    const existingUser = await this.#_User.findOne({ email });
    if (existingUser) {
      throw new BadRequest(`user already exists.`);
    }
    let user = new this.#_User({ email, password, username }).save();
    return user;
  }

  //login a user
  async login({ email, password }) {
    const user = await this.#_User.findOne({ email });

    if (!user) {
      throw new BadRequest(`email or password is incorrect.`);
    }
    const isPasswordValid: boolean = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new BadRequest(`email or password is incorrect`);
    }
    return { user };
  }

  async follow(userId: string, followerId: string) {
    const userFollowed = await this.#_User.findOne({ _id: userId });
    const userFollowing = await this.#_User.findOne({ _id: followerId });

    if (!(userFollowed || userFollowing)) {
      throw new BadRequest(`no user with that id`);
    }
    const isFollowed = userFollowed.followers.get(followerId);
    if (isFollowed) {
      //unfollow
      userFollowed.followers.delete(followerId);
    } else {
      //follow
      userFollowed.followers.set(followerId, followerId);
    }

    const userUpdatedFollower = await this.#_User
      .findByIdAndUpdate(
        { _id: userId },
        { followers: userFollowed.followers },
        { new: true, runValidators: true }
      )
      .select({ password: false });

    return userUpdatedFollower;
  }
}

export default new UserService();

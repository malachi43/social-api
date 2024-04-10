import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import conn from "../database/database.js";
import { Model, HydratedDocument } from "mongoose";
import BadRequest from "../errors/badRequest.error.js";
import paginate from "../lib/paginate.js";

interface IPost {
  description: string;
  media?: string;
  author: string;
}

type Post = {
  description: string;
  media?: string;
  author: string;
};

function cloudinaryInit() {
  return cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
}

class PostService {
  #_Post: Model<IPost>;
  constructor() {
    this.#_Post = conn.model("Post");
    cloudinaryInit();
  }

  async createPost({ description, media = null, author }: Post) {
    let obj: Post = { description, author };
    let uploadedMediaUrl: string;

    if (media) {
      const { secure_url } = await cloudinary.uploader.upload(media, {
        resource_type: "auto",
      });
      uploadedMediaUrl = secure_url;
    }
    obj.media = uploadedMediaUrl;
    const newPost: HydratedDocument<IPost> = await new this.#_Post(obj).save();
    return newPost;
  }

  async getFeedPost(id: string, skip = 1) {
    const User = conn.model("User");
    const user = await User.findById(id);

    const contentPerPage = 5;
    const skipOffset = (skip - 1) * contentPerPage;

    if (!user) {
      throw new BadRequest(`no user with this id:${id}`);
    }

    if (user.followers.size > 0) {
      let userFeed: any = await User.find(
        { _id: id },
        //limits the number of returned "followers" in the followers array.
        { followers: { $slice: [skipOffset, contentPerPage] } }
      );

      //convert map to array, so we can use arary methods.
      userFeed = Array.from(userFeed[0].followers);

      const feeds = await Promise.all(
        userFeed.map(async ([_, authorId]) => {
          const post = await this.#_Post.findOne({ author: authorId });
          if (post) {
            return post;
          }
        })
      );

      return { feeds };
    } else {
      return { feeds: [] };
    }
  }

  async getPosts(pageNumber: number) {
    const docs = await paginate({
      pageNumber,
      model: "Post",
      contentPerPage: 5,
      projection: { __v: 0 },
    });
    return { ...docs };
  }
}

export default new PostService();

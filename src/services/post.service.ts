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
    return {
      description: newPost.description,
      media: newPost.media,
      author: newPost.author,
      id: newPost._id,
    };
  }

  async getFeedPost(id: string, skip = 1) {
    const User = conn.model("User");
    const user = await User.findById(id);
    const contentPerPage = 5;
    const skipOffset = (skip - 1) * contentPerPage;

    if (!user) {
      throw new BadRequest(`no user with this id:${id}`);
    }

    if (Array.from(user.followers).length > 0) {
      let userFeed: any = await User.find(
        { _id: id },
        //limits the number of returned "followers" in the followers array(pagination).
        { followers: { $slice: [skipOffset, contentPerPage] } }
      );

      //convert map to array, so we can use arary methods.
      userFeed = Array.from(userFeed[0].followers);

      //getting each post of the user's followers.
      const feeds = await Promise.all(
        userFeed.map(async (item: [string, string]) => {
          const post: any = await (
            await this.#_Post.findOne({ author: item[1] })
          ).populate({ path: "author", select: "username" });
          if (post) {
            return {
              id: post._id.toString(),
              description: post.description,
              author: post.author,
            };
          }
        })
      );
      return feeds;
    } else {
      return [];
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

import conn from "../database/database.js";
import { Model } from "mongoose";
import paginate from "../lib/paginate.js";
import BadRequest from "../errors/badRequest.error.js";

interface ICommentLike {
  postId: string;
  author: string;
  likes?: {};
  comments?: {};
}

class CommentAndLikeService {
  #_CommentLike: Model<ICommentLike>;
  constructor() {
    this.#_CommentLike = conn.model("CommentAndLike");
  }

  async getlikesAndComments(postId: string) {
    const docs = await paginate({
      model: "CommentAndLike",
      pageNumber: 1,
      contentPerPage: 5,
      projection: { __v: 0 },
      query: { postId },
      keyname: "likesAndComments",
    });
    return { ...docs };
  }

  async likePost(postId: string, userId: string) {
    const like: any = await this.#_CommentLike.findOne({ postId });

    if (!like) {
      throw new BadRequest(`no post with this id:${postId}.`);
    }
    const User = conn.model("User");
    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new BadRequest(`user with the id:${userId} does not exist.`);
    }
    const isLiked = like.likes.get(userId);
    if (isLiked) {
      //unlike post
      like.likes.delete(userId);
    } else {
      //like post
      like.likes.set(userId, true);
    }

    const updatedLike = await this.#_CommentLike.findOneAndUpdate(
      { postId },
      { likes: like.likes },
      { new: true, runValidators: true }
    );

    return { success: true, data: updatedLike };
  }

  async commentPost({ postId, comment, userId, skip = 1 }) {
    const contentPerPage = 5;
    const skipOffset = (skip - 1) * contentPerPage;
    const post: any = await this.#_CommentLike.findOne({ postId });

    if (!post) {
      throw new BadRequest(`no post with this id:${postId}.`);
    }
    const User = conn.model("User");
    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new BadRequest(`user with the id:${userId} does not exist.`);
    }

    post.comments.push(comment);

    await this.#_CommentLike.findOneAndUpdate(
      { postId },
      { comments: post.comments },
      { new: true, runValidators: true }
    );

    //we use Model.find() to enable us perform pagination in sub-documents.
    const updatedComment: any = await this.#_CommentLike.find(
      { postId },
      //limits the number of returned "comments" in the comments array.
      { comments: { $slice: [skipOffset, contentPerPage] } }
    );

    return { data: updatedComment[0] };
  }
}

export default new CommentAndLikeService();

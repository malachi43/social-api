import conn from "../database/database.js";
import { HydratedDocument, Model } from "mongoose";
import paginate from "../lib/paginate.js";
import BadRequest from "../errors/badRequest.error.js";

interface ICommentLike {
  postId: string;
  author: string;
  likes?: {};
  comments?: {};
}

interface INoOfCommentAndLike {
  postId: string;
  author: string;
  no_of_likes?: number;
  no_of_comments?: number;
}

class CommentAndLikeService {
  #_CommentLike: Model<ICommentLike>;
  #_NoOfCommentAndLike: Model<INoOfCommentAndLike>;
  constructor() {
    this.#_CommentLike = conn.model("CommentAndLike");
    this.#_NoOfCommentAndLike = conn.model("NoOfCommentAndLike");
  }

  async getNoOfLikesAndComments(postId: string) {
    const no_of_comments_and_likes = await this.#_NoOfCommentAndLike
      .findOne({
        postId,
      })
      .populate({ path: "author", select: "username" })
      .select({ __v: 0 });
    if (!no_of_comments_and_likes) {
      throw new BadRequest(`no post with the id:${postId}`);
    }

    return { no_of_comments_and_likes };
  }

  async likePost(postId: string, userId: string) {
    const like: any = await this.#_CommentLike.findOne({ postId });
    const noOfLike: any = await this.#_NoOfCommentAndLike.findOne({ postId });

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
      //decrease the like number
      noOfLike.no_of_likes--;
    } else {
      //like post
      like.likes.set(userId, true);
      //increase the like number
      noOfLike.no_of_likes++;
    }

    //updating to the current state of like.
    const updatedLike = await this.#_CommentLike.findOneAndUpdate(
      { postId },
      { likes: like.likes },
      { new: true, runValidators: true }
    );

    //updating the no_of_likes count to reflect the current state.
    const updatedNoOfLike = await this.#_NoOfCommentAndLike.findOneAndUpdate(
      { postId },
      { no_of_likes: noOfLike.no_of_likes },
      { new: true, runValidators: true }
    );

    return { success: true };
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

    const noOfComment: HydratedDocument<INoOfCommentAndLike> =
      await this.#_NoOfCommentAndLike.findOne({ postId });
    //increase the comment count.
    noOfComment.no_of_comments++;

    //update the no_of_ comments count to reflect the current state.
    const updatedNoOfComment = await this.#_NoOfCommentAndLike.findOneAndUpdate(
      { postId },
      { no_of_comments: noOfComment.no_of_comments }
    );

    return { data: updatedComment[0] };
  }
}

export default new CommentAndLikeService();

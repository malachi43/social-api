import { Request, Response, NextFunction } from "express";
import commentAndLikeServiceService from "../services/comment_and_like.service.js";
import BadRequestError from "../errors/badRequest.error.js";

class CommentLikes {
  async getNoOfLikesAndComment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { postId } = req.params;
    const likesAndComments =
      await commentAndLikeServiceService.getNoOfLikesAndComments(postId);
    res.status(200).json({ data: { ...likesAndComments } });
  }

  async likePost(req: Request, res: Response, next: NextFunction) {
    const { postId, userId } = req.params;
    const docs = await commentAndLikeServiceService.likePost(postId, userId);
    res.status(200).json({ ...docs });
  }

  async commentOnPost(req: Request, res: Response, next: NextFunction) {
    const { postId, userId } = req.params;
    const { comment } = req.body;
    console.log(`comment: `, postId, userId);
    if (!comment) {
      throw new BadRequestError(`you cannot post an empty comment.`);
    }
    const { page } = req.query;
    const skip = Number(page);
    const docs = await commentAndLikeServiceService.commentPost({
      postId,
      userId,
      comment,
      skip,
    });

    res.status(200).json({ ...docs });
  }
}

export default new CommentLikes();

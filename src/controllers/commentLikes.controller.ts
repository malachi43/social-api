import { Request, Response, NextFunction } from "express";
import commentAndLikeServiceService from "../services/commentAndLikeService.service.js";

class CommentLikes {
  async getLikesAndComment(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    const likesAndComments =
      await commentAndLikeServiceService.getlikesAndComments(postId);
    res.status(200).json({ data: likesAndComments });
  }

  async likePost(req: Request, res: Response, next: NextFunction) {
    const { postId, userId } = req.params;
    const docs = await commentAndLikeServiceService.likePost(postId, userId);
    res.status(200).json({ ...docs });
  }

  async commentOnPost(req: Request, res: Response, next: NextFunction) {
    const { postId, userId } = req.params;
    const { comment } = req.body;
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

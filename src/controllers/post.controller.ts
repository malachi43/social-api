import { Request, Response, NextFunction } from "express";
import postService from "../services/post.service.js";

interface ICustomRequest extends Request {
  file: { buffer: string; mimetype: string };
  user: { id: string };
}

class PostController {
  async creatPost(req: ICustomRequest, res: Response, next: NextFunction) {
    const { description } = req.body;
    let dataURI: string;
    if (req.file) {
      const { buffer, mimetype } = req.file;
      dataURI = PostController.convertToBase64(buffer, mimetype);
    }
    const media = dataURI || "";
    const { id } = req.user;
    const post = await postService.createPost({
      description,
      media,
      author: id,
    });
    res.status(200).json({ post });
  }

  async getFeed(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { page } = req.query;
    const skip = Number(page);
    const feeds = postService.getFeedPost(id, skip);
    res.status(200).json({ ...feeds });
  }

  async getPosts(req: Request, res: Response, next: NextFunction) {
    const { page } = req.query;
    const posts = await postService.getPosts(Number(page));
    res.status(200).json(posts);
  }
  static convertToBase64(buffer: string, mimetype: string): string {
    const b64 = Buffer.from(buffer).toString("base64");
    let dataURI = `data:${mimetype};base64,${b64}`;
    return dataURI;
  }
}

export default new PostController();

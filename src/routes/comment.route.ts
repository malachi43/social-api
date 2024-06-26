import express from "express";
import commentLikesController from "../controllers/comment_likes.controller.js";
import asyncWrapper from "../lib/asyncWrapper.js";
import isAuthenticated from "../middlewares/authencticate.middleware.js";
import { isCommentPayloadValid } from "../middlewares/validatePayload.middleware.js";
const router = express.Router({ mergeParams: true });

router.post(
  "/:userId",
  asyncWrapper(isCommentPayloadValid),
  asyncWrapper(isAuthenticated),
  asyncWrapper(commentLikesController.commentOnPost)
);

export default router;

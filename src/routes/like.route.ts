import express from "express";
const router = express.Router();
import commentLikesController from "../controllers/commentLikes.controller.js";
import asyncWrapper from "../lib/asyncWrapper.js";
import isAuthenticated from "../middlewares/authencticate.middleware.js";

router.post(
  "/:postId/users/:userId",
  asyncWrapper(isAuthenticated),
  asyncWrapper(commentLikesController.likePost)
);

export default router;

import express from "express";
import commentLikesController from "../controllers/comment_likes.controller.js";
import asyncWrapper from "../lib/asyncWrapper.js";
import isAuthenticated from "../middlewares/authencticate.middleware.js";
const router = express.Router({ mergeParams: true });

router.get(
  "/",
  asyncWrapper(isAuthenticated),
  asyncWrapper(commentLikesController.getNoOfLikesAndComment)
);

export default router;

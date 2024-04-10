import express from "express";
import commentLikesController from "../controllers/commentLikes.controller.js";
import asyncWrapper from "../lib/asyncWrapper.js";
import isAuthenticated from "../middlewares/authencticate.middleware.js";
const router = express.Router();

router.get(
  "/",
  asyncWrapper(isAuthenticated),
  asyncWrapper(commentLikesController.getLikesAndComment)
);

export default router;

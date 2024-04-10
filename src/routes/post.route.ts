import express from "express";
import postController from "../controllers/post.controller.js";
import asyncWrapper from "../lib/asyncWrapper.js";
import isAuthenticated from "../middlewares/authencticate.middleware.js";
import { isPostPayloadValid } from "../middlewares/validatePayload.middleware.js";
const router = express.Router();

router.post(
  "/",
  asyncWrapper(isPostPayloadValid),
  asyncWrapper(isAuthenticated),
  asyncWrapper(postController.creatPost)
);
router.get(
  "/feeds",
  asyncWrapper(isAuthenticated),
  asyncWrapper(postController.getFeed)
);
router.get(
  "/",
  asyncWrapper(isAuthenticated),
  asyncWrapper(postController.getPosts)
);

export default router;

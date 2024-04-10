import express from "express";
import userController from "../controllers/user.controller.js";
import asyncWrapper from "../lib/asyncWrapper.js";
import { isUserPayloadValid } from "../middlewares/validatePayload.middleware.js";
const router = express.Router();

router.post(
  "/login",
  asyncWrapper(isUserPayloadValid),
  asyncWrapper(userController.login)
);
router.post(
  "/register",
  asyncWrapper(isUserPayloadValid),
  asyncWrapper(userController.register)
);
router.get("/:userId/follow/:id", asyncWrapper(userController.follow));

export default router;

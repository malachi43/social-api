import express from "express";
import userController from "../controllers/user.controller.js";
import asyncWrapper from "../lib/asyncWrapper.js";
import { isRegisterPayloadValid,isLoginPayloadValid } from "../middlewares/validatePayload.middleware.js";
const router = express.Router();

router.post(
  "/login",
  asyncWrapper(isLoginPayloadValid),
  asyncWrapper(userController.login)
);
router.post(
  "/register",
  asyncWrapper(isRegisterPayloadValid),
  asyncWrapper(userController.register)
);
router.get("/:userId/follow/:id", asyncWrapper(userController.follow));

export default router;

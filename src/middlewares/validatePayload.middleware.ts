import { Request, Response, NextFunction } from "express";
import joi from "joi";

//validate user payload
async function isUserPayloadValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = joi.object({
    username: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
  });

  await schema.validateAsync(req.body);
  next();
}

//validate comment payload
async function isCommentPayloadValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = joi.object({
    comments: joi.string().optional(),
  });

  await schema.validateAsync(req.body);
  next();
}

//validate post payload
async function isPostPayloadValid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = joi.object({
    description: joi.string().required(),
    media: joi.string().optional(),
    // author: joi.string().required().length(24),
  });

  await schema.validateAsync(req.body);
  next();
}

export { isUserPayloadValid, isCommentPayloadValid, isPostPayloadValid };

import mongoose, { Schema } from "mongoose";

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };

const commentAndLikeSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "comment must be reference by a postId."],
    },
    likes: {
      type: Map,
      of: Boolean,
      default: {},
    },
    comments: {
      type: [String],
      default: [],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "post must reference a user."],
    },
  },
  opts
);

export default commentAndLikeSchema;

import mongoose, { Schema } from "mongoose";

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };

const noOfCommentsAndLikesSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "comment must be reference by a postId."],
    },
    no_of_likes: {
      type: Number,
      default: 0,
    },
    no_of_comments: {
      type: Number,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "post must reference a user."],
    },
  },
  opts
);

export default noOfCommentsAndLikesSchema;

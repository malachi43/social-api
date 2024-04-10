import { Schema } from "mongoose";
import conn from "../database/database.js";

const postSchema = new Schema({
  description: {
    type: String,
    required: [true, "the post must contain a body."],
  },
  media: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: [true, "post must reference a user."],
    ref: "User",
  },
});

postSchema.post("save", async function (doc) {
  const { _id, author } = doc;
  const Comment = conn.model("CommentAndLike");
  await new Comment({ postId: _id, author }).save();
});

export default postSchema;

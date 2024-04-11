import dotenv from "dotenv";
dotenv.config();
import mongoose, { connect } from "mongoose";
import userSchema from "../models/user.schema.js";
import postSchema from "../models/post.schema.js";
import commentAndLikeSchema from "../models/comments_and_likes.schema.js";
import noOfLikeAndCommentSchema from "../models/no_comments_and_likes.schema.js";

async function connectToDatabase(url: string): Promise<typeof mongoose> {
  const connection = await connect(url);
  connection.model("User", userSchema);
  connection.model("Post", postSchema);
  connection.model("CommentAndLike", commentAndLikeSchema);
  connection.model("NoOfCommentAndLike", noOfLikeAndCommentSchema)
  return connection;
}

//using top-level await (available only in  ES-modules).
const conn = await connectToDatabase(process.env.MONGO_URI);
export default conn;

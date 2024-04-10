import dotenv from "dotenv";
dotenv.config();
import mongoose, { connect } from "mongoose";
import userSchema from "../models/user.schema.js";
import postSchema from "../models/post.schema.js";
import commentSchema from "../models/commentAndLikeSchema.schema.js";

async function connectToDatabase(url: string): Promise<typeof mongoose> {
  const connection = await connect(url);
  connection.model("User", userSchema);
  connection.model("Post", postSchema);
  connection.model("CommentAndLike", commentSchema);

  return connection;
}

//using top-level await (available only in  ES-modules).
const conn = await connectToDatabase(process.env.MONGO_URI);
export default conn;

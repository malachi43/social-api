import dotenv from "dotenv";
dotenv.config();
import cluster from "cluster";
import os from "node:os";
const numOfCPU = os.availableParallelism();
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import notFound from "./middlewares/notFound.middleware.js";
import multer from "multer";
import postRoute from "./routes/post.route.js";
import userRoute from "./routes/user.route.js";
import likeRoute from "./routes/like.route.js";
import commentRoute from "./routes/comment.route.js";
import commentLikeRoute from "./routes/commentAndLike.route.js";

//this creates an instance of this app equal to the number of CPU cores, this ensures high throughput.
if (cluster.isPrimary) {
  for (let i = 0; i < numOfCPU; ++i) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`process ${worker.process.pid} exited with code: ${code}`);
    cluster.fork();
  });
} else {
  const storage = multer.memoryStorage();
  const upload = multer({ storage });
  const app = express();
  const server = createServer(app);
  const io = new Server(server);
  // export default io;

  io.on("connection", () => {
    console.log(`socket connected`);
  });
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(helmet());

  //parse JSON
  app.use(express.json());
  //parse x-www-form-urlencoded data
  app.use(express.urlencoded({ extended: false }));

  app.use("/api/v1/posts", upload.single("upload"), postRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/likes", likeRoute);
  app.use("/api/v1/comments/:postId", commentLikeRoute);
  app.use("/api/v1/comments/:postId/users", commentRoute);

  app.use(notFound);
  app.use(errorHandler);

  server.listen(PORT, () => {
    console.log(
      `Server is listening on port:${PORT}. Press Ctrl+C to terminate.`
    );
  });

  const mention = `i like @malachi cos he's awesome I wish @MIKEY was here and @lishNisha @momma they are also awesome @zaddy`;

  function getMention(comment: string): string[] {
    const mentionArray = [];

    const regex = /@\w+\b/gm;
    let m: any;

    while ((m = regex.exec(mention)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match: string) => {
        mentionArray.push(match);
      });
    }

    return mentionArray;
  }

  // const res = getMention(mention);
  // res.forEach((tag) => {
  //   console.log(tag, tag.substring(1));
  //   io.emit(tag.substring(1), `${tag.substring(1)} was mentioned in a post.`);
  // });
}

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
import session from "express-session";
import MongoStore from "connect-mongo";
import errorHandler from "./middlewares/error_handler.middleware.js";
import notFound from "./middlewares/not_found.middleware.js";
import conn from "./database/database.js";
import postRoute from "./routes/post.route.js";
import userRoute from "./routes/user.route.js";
import likeRoute from "./routes/like.route.js";
import commentRoute from "./routes/comment.route.js";
import commentAndLikeRoute from "./routes/comment_and_like.route.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

//this helps us to send notification to users in real-time
export default io;

io.on("connection", () => {
  console.log(`socket connected`);
});

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
  const sessionConfig = {
    name: "airfile",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      // touchAfter: 24 * 3600 // time period in seconds
    }),
  };

  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(helmet());

  //session configuration
  app.use(session(sessionConfig));

  //parse JSON and attach to req.body
  app.use(express.json());
  //parse x-www-form-urlencoded data and attach to req.body
  app.use(express.urlencoded({ extended: false }));

  app.use("/api/v1/posts", postRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/likes", likeRoute);
  app.use("/api/v1/comments/:postId", commentAndLikeRoute);
  app.use("/api/v1/comments/:postId/users", commentRoute);
  app.use("/hello", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).sendFile(join(__dirname, "index.html"));
  });
  app.use(notFound);
  app.use(errorHandler);

  async function startServer() {
    server.listen(PORT, () => {
      console.log(
        `Server is listening on port:${PORT}. Press Ctrl+C to terminate.`
      );
    });
  }

  startServer();
}

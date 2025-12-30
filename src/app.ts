import express, { Application, Request, Response } from "express";
import cors from "cors";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

import { PostRouter } from "./modules/post/post.route";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/v1/posts", PostRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Prisma World");
});

export default app;

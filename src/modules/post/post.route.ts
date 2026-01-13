import express, { Router } from "express";

import { PostController } from "./post.controller";

import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", PostController.getAllPosts);

router.get("/:postId", PostController.getPostById);

router.post("/", auth(UserRole.USER), PostController.createPost);

export const PostRouter: Router = router;

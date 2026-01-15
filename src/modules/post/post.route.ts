import express, { Router } from "express";

import { PostController } from "./post.controller";

import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", PostController.getAllPosts);

router.get("/stats", auth(UserRole.ADMIN), PostController.getStats);

router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.getMyPosts
);

router.get("/:postId", PostController.getPostById);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.createPost
);

router.patch(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.updatePost
);

router.delete(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  PostController.deletePost
);

export const PostRouter: Router = router;

import express, { Router } from "express";
import { CommentController } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/author/:authorId", CommentController.getCommentByAuthor);

router.get("/:commentId", CommentController.getCommentById);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.createComment
);

export const CommentRouter: Router = router;

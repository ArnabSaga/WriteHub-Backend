import express, { Router } from "express";
import { CommentController } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.createComment
);

export const CommentRouter: Router = router;

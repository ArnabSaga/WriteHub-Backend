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

//* own comment can be delete => 1st he/she must be login, 2nd check it's him/her comment
router.delete(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.deleteComment
);

router.patch(
  "/:commentId",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.updateComment
);

router.patch(
  "/:commentId/moderate",
  auth(UserRole.ADMIN),
  CommentController.moderateComment
);

export const CommentRouter: Router = router;

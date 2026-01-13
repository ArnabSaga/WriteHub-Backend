import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;

    const result = await CommentService.createComment(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Comment Creation Failed",
      details: error,
    });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const result = await CommentService.getCommentById(commentId as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Comment fatched Failed",
      details: error,
    });
  }
};

const getCommentByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;

    const result = await CommentService.getCommentByAuthor(authorId as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Comment fatched Failed",
      details: error,
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;

    const result = await CommentService.deleteComment(
      commentId as string,
      user?.id as string
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Comment delete Failed",
      details: error,
    });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const updateData = req.body;
    const { commentId } = req.params;

    const result = await CommentService.updateComment(
      commentId as string,
      updateData,
      user?.id as string
    );
    res.status(200).json(result);
  } catch (error: any) {
    console.log(error)
    res.status(400).json({
      error: "Comment update Failed",
      details: error,
    });
  }
};

export const CommentController = {
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteComment,
  updateComment,
};

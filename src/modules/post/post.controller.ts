import { Request, Response } from "express";

import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized!",
      });
    }

    const result = await PostService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Post Creation Failed",
      details: error,
    });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const result = await PostService.getAllPosts({
      search: searchString,
      tags,
    });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Failed to fetch posts",
      details: error,
    });
  }
};

export const PostController = {
  createPost,
  getAllPosts,
};

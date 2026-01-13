import { Request, Response } from "express";

import { PostService } from "./post.service";

import { PostStatus } from "../../../generated/prisma/enums";

import paginationSortingHelper from "../../helpers/paginationSortingHelper";

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

    // true or false
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    //* Pagination & Sorting
    const options = paginationSortingHelper(req.query);
    const { page, limit, skip, sortBy, sortOrder } = options;

    const result = await PostService.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Failed to fetch posts",
      details: error,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post ID is required!");
    }

    const result = await PostService.getPostById(postId);

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
  getPostById,
};

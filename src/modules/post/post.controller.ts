import { Request, Response } from "express";

import { PostService } from "./post.service";

import { PostStatus } from "../../../generated/prisma/enums";

import paginationSortingHelper from "../../helpers/paginationSortingHelper";

import { UserRole } from "../../middleware/auth";

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

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Your are unauthorized");
    }

    const result = await PostService.getMyPosts(user.id);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Post fetched posts",
      details: error,
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { postId } = req.params;
    const data = req.body;

    if (!user) {
      throw new Error("Your are unauthorized");
    }

    const isAdmin = user.role === UserRole.ADMIN;

    const result = await PostService.updatePost(
      postId as string,
      data,
      user.id,
      isAdmin
    );

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Post update Failed";
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { postId } = req.params;

    if (!user) {
      throw new Error("Your are unauthorized");
    }

    const isAdmin = user.role === UserRole.ADMIN;

    const result = await PostService.deletePost(
      postId as string,
      user.id,
      isAdmin
    );

    res.status(200).json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Post Delete Failed";
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

const getStats = async (req: Request, res: Response) => {
  try {
    const result = await PostService.getStats();
    res.status(200).json(result);
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "Stats fetched failed!";
    res.status(400).json({
      error: errorMessage,
      details: e,
    });
  }
};

export const PostController = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats,
};

import { prisma } from "../../lib/prisma";
import { CommentStatus } from "../../../generated/prisma/enums";
import { date } from "better-auth/*";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  return await prisma.comment.create({
    data: payload,
  });
};

const getCommentById = async (commentId: string) => {
  return await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          status: true,
          views: true,
        },
      },
    },
  });
};

const getCommentByAuthor = async (authorId: string) => {
  console.log({ authorId });
  return await prisma.comment.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("User provided input is invaild!  ");
  }

  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
};

const updateComment = async (
  commentId: string,
  data: {
    content?: string;
    satuts?: CommentStatus;
  },
  authorId: string
) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  if (!commentData) {
    throw new Error("User provided input is invaild!  ");
  }

  return await prisma.comment.update({
    where: {
      id: commentData.id,
      authorId,
    },
    data,
  });
};

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return await prisma.comment.update({
    where: {
      id,
    },
    data,
  });
};

export const CommentService = {
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteComment,
  updateComment,
  moderateComment,
};

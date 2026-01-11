import { prisma } from "../../lib/prisma";
import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";

const createPost = async (
  data: Omit<Post, "id" | "cretedAt" | "updateAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPosts = async ({
  search,
  tags,
}: {
  search: string | undefined;
  tags: string[] | [];
}) => {
  const andConditions: PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  const allPost = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },
  });
  return allPost;
};

export const PostService = {
  createPost,
  getAllPosts,
};

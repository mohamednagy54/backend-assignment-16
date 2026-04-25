import z from "zod";
import { generalFields } from "../../common";

export const createPostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  attachments: z.array(z.string().url()).optional(),
}).refine((data) => data.content || (data.attachments && data.attachments.length > 0), {
  message: "post must have content or at least one attachment",
});

export const updatePostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
  attachments: z.array(z.string().url()).optional(),
});

export const postIdParamSchema = z.object({
  postId: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid post id"),
});

export const reactToPostSchema = z.object({
  reaction: z.number().int().min(0).max(5),
});

export const getPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

import z from "zod";
import {
  createPostSchema,
  updatePostSchema,
  postIdParamSchema,
  reactToPostSchema,
  getPostsQuerySchema,
} from "./post.validation";

export type CreatePostDto = z.infer<typeof createPostSchema>;
export type UpdatePostDto = z.infer<typeof updatePostSchema>;
export type PostIdParamDto = z.infer<typeof postIdParamSchema>;
export type ReactToPostDto = z.infer<typeof reactToPostSchema>;
export type GetPostsQueryDto = z.infer<typeof getPostsQuerySchema>;

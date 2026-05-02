import z from "zod";
import {
  updatePostSchema,
  postIdParamSchema,
  reactToPostSchema,
  getPostsQuerySchema,
} from "./post.validation";
import { Types } from "mongoose";

export interface CreatePostDto  {
  content?: string;
  attachments?: string[];
};




export interface AddReactionDTO { 
  postId: Types.ObjectId;
  
}



export type UpdatePostDto = z.infer<typeof updatePostSchema>;
export type PostIdParamDto = z.infer<typeof postIdParamSchema>;
export type GetPostsQueryDto = z.infer<typeof getPostsQuerySchema>;

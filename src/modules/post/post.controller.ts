import { Router } from "express";
import postService from "./post.service";
import type { NextFunction, Request, Response } from "express";
import { isValid } from "../../middleware";
import isAuthenticated from "../../middleware/auth.middleware";
import {
  updatePostSchema,
  postIdParamSchema,
  reactToPostSchema,
  getPostsQuerySchema,
  createPostSchema,
} from "./post.validation";
import { Types } from "mongoose";

const router = Router();


// create post
router.post(
  "/",
  // isAuthenticated,
  isValid(createPostSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const createdPost = await postService.create(
      new Types.ObjectId("69ec71f006e43ccbff317bc3"),
      req.body,
    );
    return res.status(201).json({
      message: "post created successfully",
      success: true,
      data: { createdPost },
    });
  },
);

// get all posts (feed)
router.get(
  "/",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    const query = getPostsQuerySchema.parse(req.query);
    const posts = await postService.getPosts(query);
    return res.status(200).json({
      message: "posts fetched successfully",
      success: true,
      data: posts,
    });
  },
);

// get single post
router.get(
  "/:postId",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = postIdParamSchema.parse(req.params);
    const post = await postService.getPostById(postId);
    return res.status(200).json({
      message: "post fetched successfully",
      success: true,
      data: post,
    });
  },
);

// get posts by user
router.get(
  "/user/:userId",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId as string;
    const query = getPostsQuerySchema.parse(req.query);
    const posts = await postService.getPostsByUser(userId, query);
    return res.status(200).json({
      message: "posts fetched successfully",
      success: true,
      data: posts,
    });
  },
);

// update post
router.patch(
  "/:postId",
  isAuthenticated,
  isValid(updatePostSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = postIdParamSchema.parse(req.params);
    const post = await postService.updatePost(
      req.user._id.toString(),
      postId,
      req.body,
    );
    return res.status(200).json({
      message: "post updated successfully",
      success: true,
      data: post,
    });
  },
);

// delete post

router.delete(
  "/:postId",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = postIdParamSchema.parse(req.params);
    await postService.deletePost(req.user._id.toString(), postId);
    return res.status(200).json({
      message: "post deleted successfully",
      success: true,
    });
  },
);

// react to post
router.post(
  "/:postId/react",
  isAuthenticated,
  isValid(reactToPostSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = postIdParamSchema.parse(req.params);
    const result = await postService.reactToPost(
      req.user._id.toString(),
      postId,
      req.body,
    );
    return res.status(200).json({
      success: true,
      ...result,
    });
  },
);

export default router;

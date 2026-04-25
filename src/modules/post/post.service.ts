import { Types } from "mongoose";
import {
  BadRequestException,
  NotFoundException,
  UnAuthorizedException,
} from "../../common";
import { ON_MODEL, SYS_REACTION } from "../../common/enums";
import { PostRepository } from "../../DB/models/post/post.repository";
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository";
import {
  CreatePostDto,
  GetPostsQueryDto,
  ReactToPostDto,
  UpdatePostDto,
} from "./post.dto";

class PostService {
  private postRepository: PostRepository;
  private userReactionRepository: UserReactionRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.userReactionRepository = new UserReactionRepository();
  }

  // create post
  async createPost(userId: string, createPostDto: CreatePostDto) {
    const post = await this.postRepository.create({
      userId: new Types.ObjectId(userId),
      ...(createPostDto.content && { content: createPostDto.content }),
      ...(createPostDto.attachments && { attachments: createPostDto.attachments }),
    });
    return post;
  }

  // get all posts (feed) with pagination
  async getPosts(query: GetPostsQueryDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const posts = await this.postRepository.getAll(
      {},
      undefined,
      { skip, limit, sort: { createdAt: -1 }, populate: { path: "userId", select: "userName profilePic" } },
    );
    return posts;
  }

  // get single post by id
  async getPostById(postId: string) {
    const post = await this.postRepository.getOne(
      { _id: postId },
      undefined,
      { populate: { path: "userId", select: "userName profilePic" } },
    );
    if (!post) throw new NotFoundException("post not found");
    return post;
  }

  // get posts by user
  async getPostsByUser(userId: string, query: GetPostsQueryDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const posts = await this.postRepository.getAll(
      { userId: new Types.ObjectId(userId) },
      undefined,
      { skip, limit, sort: { createdAt: -1 }, populate: { path: "userId", select: "userName profilePic" } },
    );
    return posts;
  }

  // update post (only owner)
  async updatePost(userId: string, postId: string, updatePostDto: UpdatePostDto) {
    // check post existence
    const post = await this.postRepository.getOne({ _id: postId });
    if (!post) throw new NotFoundException("post not found");

    // check ownership
    if (post.userId.toString() !== userId) {
      throw new UnAuthorizedException("you are not authorized to update this post");
    }

    const updatedPost = await this.postRepository.updateOne(
      { _id: postId },
      updatePostDto,
    );
    return updatedPost;
  }

  // delete post (only owner)
  async deletePost(userId: string, postId: string) {
    // check post existence
    const post = await this.postRepository.getOne({ _id: postId });
    if (!post) throw new NotFoundException("post not found");

    // check ownership
    if (post.userId.toString() !== userId) {
      throw new UnAuthorizedException("you are not authorized to delete this post");
    }

    await this.postRepository.deleteOne({ _id: postId });
  }

  // react to post (toggle: create or remove reaction)
  async reactToPost(userId: string, postId: string, reactToPostDto: ReactToPostDto) {
    // check post existence
    const post = await this.postRepository.getOne({ _id: postId });
    if (!post) throw new NotFoundException("post not found");

    const userObjectId = new Types.ObjectId(userId);
    const postObjectId = new Types.ObjectId(postId);

    // check if user already reacted
    const existingReaction = await this.userReactionRepository.getOne({
      userId: userObjectId,
      refId: postObjectId,
      onModel: ON_MODEL.Post,
    });

    if (existingReaction) {
      // if same reaction => remove it (toggle off)
      if (existingReaction.reaction === reactToPostDto.reaction) {
        await this.userReactionRepository.deleteOne({ _id: existingReaction._id });
        await this.postRepository.updateOne(
          { _id: postId },
          { $inc: { reactionsCount: -1 } },
        );
        return { message: "reaction removed" };
      }

      // if different reaction => update it
      await this.userReactionRepository.updateOne(
        { _id: existingReaction._id },
        { reaction: reactToPostDto.reaction },
      );
      return { message: "reaction updated" };
    }

    // create new reaction
    await this.userReactionRepository.create({
      userId: userObjectId,
      refId: postObjectId,
      onModel: ON_MODEL.Post,
      reaction: reactToPostDto.reaction as SYS_REACTION,
    });

    await this.postRepository.updateOne(
      { _id: postId },
      { $inc: { reactionsCount: 1 } },
    );

    return { message: "reaction added" };
  }
}

export default new PostService();
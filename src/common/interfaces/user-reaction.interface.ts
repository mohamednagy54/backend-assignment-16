import { Types } from "mongoose";
import { ON_MODEL, SYS_REACTION } from "../enums";

export interface IUserReaction {
  userId: Types.ObjectId;
  refId: Types.ObjectId; // post id or comment id or reel id or story id
  onModel: ON_MODEL;
  reaction: SYS_REACTION;
}

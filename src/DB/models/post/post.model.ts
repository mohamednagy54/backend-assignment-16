import { model, Schema } from "mongoose";
import { IPost } from "../../../common";

const schema = new Schema<IPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, trim: true },
    attachments: { type: [String], default: [] },
    reactionsCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharedCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Post = model("Post", schema);

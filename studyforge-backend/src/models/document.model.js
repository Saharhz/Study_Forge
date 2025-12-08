import mongoose from "mongoose";

const { Schema, model } = mongoose;
const DocumentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    sourceType: {
      type: String,
      enum: ["pdf", "url"],
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    storageKey: {
      type: String, // file path or cloud key (e.g. Supabase/S3)
      trim: true,
    },
    status: {
      type: String,
      enum: ["queued", "processing", "ready", "failed"],
      default: "queued",
      index: true,
    },
    meta: {
      pages: { type: Number },
      contentType: { type: String },
      sizeKB: { type: Number },
    },
  },
  { timestamps: true }
);

DocumentSchema.set("toJson", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Document = model("Document", DocumentSchema);

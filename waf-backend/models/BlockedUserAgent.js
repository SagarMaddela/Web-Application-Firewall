import mongoose from "mongoose";

const blockedUserAgentSchema = new mongoose.Schema({
  userAgent: { type: String, required: true, unique: true },
});

export const BlockedUserAgent = mongoose.model("BlockedUserAgent", blockedUserAgentSchema);


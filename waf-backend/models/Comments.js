import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    Name:String,
    text: String
});
export const Comment = mongoose.model("Comment", commentSchema);
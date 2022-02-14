const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    header: { type: String, required: true},
    description: { type: String, required: true},
    link: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;

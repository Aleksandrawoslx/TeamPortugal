const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    header: String,
    description: String,
    link: String,
    username: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;

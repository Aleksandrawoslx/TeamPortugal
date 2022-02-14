const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    header: String,
    description: String,
    link: String,
    username: { type: Schema.Types.ObjectId, ref: "User" },
    category: String,
  },
  {
    timestamps: true,
  }
);

const User = model("Post", postSchema);

module.exports = Post;

const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  { 
    kind: {type: String},
    content: { type: Array, required: true},
    publishedAt: {type: String},
    stringId: {type: String},
    // link: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;

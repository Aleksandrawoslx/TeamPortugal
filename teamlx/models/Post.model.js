const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    header: String,
    description: String,
    link: URL,
    username: { type: Schema.Types.ObjectId, ref: "User" },
    category: String,
  },
  {
    timestamps: true,
  }
);

const User = model("Post", userSchema);

module.exports = Post;

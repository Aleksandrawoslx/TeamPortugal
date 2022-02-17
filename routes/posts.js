const Post = require("../models/Post.model");
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");

const router = require("express").Router();

router.get("/read-posts", (req, res, next) => {
  Post.find()
    .populate("author")
    .then((postsfromDb) => {
      console.log(postsfromDb);
      res.render("post/read-posts", { posts: postsfromDb });
    });
});

router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("post/new-post");
});

router.post("/create", isLoggedIn, (req, res, next) => {
  // console.log(req.body.blocks)
  let now = new Date();
  let nowString = now.toISOString().split(".")[0].replace(/[^\d]/gi, "");

  const postDetails = {
    kind: "post",
    publishedAt: nowString,
    content: req.body.blocks,
    author: req.session.user._id,
  };
  Post.create(postDetails).then((post) => {
    res.redirect("/posts/read-posts");
  });
});

router.post("/:postId/delete", isLoggedIn, (req, res) => {
  // Step 1: check current user is owner
  const currentUserId = req.session.user._id;
  const postId = req.params.postId;

  Post.findById(postId).then(function (post) {
    if (currentUserId.toString() === post.author.toString()) {
      Post.findByIdAndDelete(req.params.postId)
        .then(() => res.redirect("/"))
        .catch((error) => console.log(error));
    }
    else res.send ("Hello world")
  });
});

module.exports = router;

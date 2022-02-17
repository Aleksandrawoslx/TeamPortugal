const Post = require("../models/Post.model");
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");

const router = require("express").Router();

router.get("/read-posts", (req, res, next) => {
  console.log(req.session)
  Post.find() 
    .populate("author")
    .then((postsfromDb) => {
      const currentUserId = req.session.user._id.toString();
      console.log(postsfromDb);
      console.log(currentUserId)
      res.render("post/read-posts", { posts: postsfromDb,
       currentUserId: currentUserId});
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
    stringId: req.session.user._id.toString(),
    publishedAt: nowString,
    content: req.body.blocks,
    author: req.session.user._id,
  };
  Post.create(postDetails).then((post) => {
    res.redirect("/posts/read-posts");
  });
});

router.post("/:postId/delete", isLoggedIn, (req, res) => {
  const currentUserId = req.session.user._id.toString();
  const postId = req.params.postId.toString();

  Post.findById(postId).then(function (post) {
    if (currentUserId == post.author) {
      Post.findByIdAndDelete(req.params.postId)
        .then(() => res.redirect("/posts/read-posts"))
        .catch((error) => console.log(error));
    } else res.send("You can't delete the article you have not written");
  });
});

module.exports = router;

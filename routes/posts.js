const Post = require("../models/Post.model");
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");

const router = require("express").Router();

router.get("/read-posts", (req, res, next) => {
  console.log(req.session);
  Post.find()
    .sort({ createdAt: -1 })
    .populate("author")
    .then((postsfromDb) => {
      res.render("post/read-posts", { posts: postsfromDb });
    });
});

router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("post/new-post");
});

router.post("/create", isLoggedIn, (req, res, next) => {
  // console.log(req.body.blocks)
  let now = new Date();
  function strMonth(month) {
    if (month<10) {
        return "0" + month.toString()
    }
    return month
}
let nowString = now.getFullYear() +"-"+ strMonth(now.getMonth() + 1)  +"-"+ now.getDate(); 

  const postDetails = {
    kind: "post",
    publishedAt: nowString,
    content: req.body.blocks,
    author: req.session.user,
    // aleks version// author: req.session.user._id
  };
  Post.create(postDetails).then((post) => {
    res.redirect("/posts/read-posts")
  });
});

router.post("/:postId/delete", isLoggedIn, (req, res) => {
  const currentUserId = req.session.user._id;
  const postId = req.params.postId;
  console.log("inside delete route");
  console.log("req.session.user", req.session.user._id);

  Post.findById(postId).then(function (post) {
    console.log("hello post!");
    console.log(post);
    if (currentUserId.toString() == post.author.toString()) {
      Post.findByIdAndDelete(req.params.postId)

        .then(() => res.render("post/delete-success"))
        // .then(() => res.redirect("/posts/read-posts"))
        .catch((error) => console.log(error));
    } else res.render("post/delete-forbidden");
  });
});

module.exports = router;

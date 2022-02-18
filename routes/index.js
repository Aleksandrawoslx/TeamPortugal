const router = require("express").Router();
const Post = require("../models/Post.model");
const NewsAPI = require("newsapi");

/* GET home page */
// router.get("/", (req,res,next) =>{
//   res.send("Hello from the other side")
// })

//  temporary route change (until newsapi works again)
router.get("/", (req, res, next) => {
  let mixArr = [];

  Post.find()
    .populate("author")
    .then((postsfromDb) => {
      // console.log(postsfromDb)
      mixArr = mixArr.concat(postsfromDb);

      // res.render("post/read-posts", {posts: postsfromDb})
    });

  const newsapi = new NewsAPI("f07b973466da4070a05742e1dc7d5a3c");

  newsapi.v2
    .everything({
      sources:
        "bbc-news, edition.cnn.com, theverge.com/tech, cnet.com/news, technewsworld.com, techcrunch.com, euronews.com, vox.com, nbcnews.com, time.com",
      language: "en",
      sortBy: "publishedAt",
    })
    .then((data) => {
      mixArr = mixArr.concat(data.articles);

      mixArr.sort(function (a, b) {
        return a.publishedAt.localeCompare(b.publishedAt);
      });
      return mixArr.reverse();
      // res.render("post/news-thread", { article: data.articles });
    })
    .then(function (data) {
      console.log(data);
      res.render("index", { posts: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

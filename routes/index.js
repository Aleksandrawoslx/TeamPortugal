const router = require("express").Router();
const Post = require("../models/Post.model");
const NewsAPI = require("newsapi");

/* GET home page */
router.get("/", (req,res,next) =>{
  res.send("Hello from the other side")
})

//  temporary route change (until newsapi works again)
router.get("/newsfeed", (req, res, next) => {
  let mixArr = [];

  Post.find()
    .populate("author")
    .then((postsfromDb) => {
      // console.log(postsfromDb)
      mixArr = mixArr.concat(postsfromDb);

      // res.render("post/read-posts", {posts: postsfromDb})
    });

  const newsapi = new NewsAPI("c49288be43e54d4cb6223673e4281426");

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
        if (a.publishedAt < b.publishedAt) {
          return 1;
        }
        if (a.publishedAt > b.publishedAt) {
          return -1;
        }
      });
      return mixArr;
      // res.render("post/news-thread", { article: data.articles });
    })
    .then(function (data) {
      res.render("index", { posts: data });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

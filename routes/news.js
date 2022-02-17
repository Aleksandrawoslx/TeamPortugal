const router = require("express").Router();
const NewsAPI = require("newsapi");
router.get("/", (req, res) => {
  // res.send("news");
  const newsapi = new NewsAPI(process.env.API_KEY);
  newsapi.v2
    .everything({
      q: "cnn",
      language: "en",
    })
    .then((data) => {
      res.render("post/news-thread", { article: data.articles });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/news-search", (req, res) => {
  console.log(req.body.search);
  const queryTerm = req.body.search;
  const newsapi = new NewsAPI(process.env.API_KEY);
  newsapi.v2
    .everything({
      q: queryTerm,
      language: "en",
    })
    .then((data) => {
      console.log(data.articles)
      res.render("post/news-thread", { article: data.articles });
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;

const router = require("express").Router();
const NewsAPI = require("newsapi");

router.get("/", (req, res) => {
  // res.send("news");
  const newsapi = new NewsAPI(process.env.API_KEY);
  newsapi.v2
    .everything({
      sources:
        "bbc-news, edition.cnn.com, theverge.com/tech, cnet.com/news, technewsworld.com, techcrunch.com, euronews.com, vox.com, nbcnews.com, time.com",
      language: "en",
      sortBy: "publishedAt",
    })
    .then((data) => {
      res.render("post/news-thread", { article: data.articles });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/news-search", (req, res) => {
  const queryTerm = req.body.search;
  const newsapi = new NewsAPI(process.env.API_KEY);
  newsapi.v2
    .everything({
      q: queryTerm,
      language: "en",
      sortBy: "publishedAt",
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

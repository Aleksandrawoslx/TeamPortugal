const router = require("express").Router();
const NewsAPI = require("newsapi");

router.get("/", (req, res) => {
  // res.send("news");

  const newsapi = new NewsAPI(process.env.API_KEY);

  newsapi.v2
    .everything({
      //q: "bitcoin",
      domains:
        "nbcnews.com, edition.cnn.com, foxnews.com, msnbc.com, www.nbcnews.com, bbc.co.uk, techcrunch.com, cnet.com",
      language: "en",
      page: 1,
    })
    .then((data) => {
      console.log(data.articles);
      res.render("post/news-thread", { article: data.articles });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

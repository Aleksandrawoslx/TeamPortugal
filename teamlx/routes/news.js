const router = require("express").Router();
const NewsAPI = require("newsapi");

router.get("/", (req, res) => {
  // res.send("news");
  res.render("post/news-thread");

  const newsapi = new NewsAPI(process.env.API_KEY);

  newsapi.v2
    .everything({
      q: "bitcoin",
      language: "en",
    })
    .then((data) => {
      console.log(data);
      res.render("post/news-thread");
    });
});

// const search = document.querySelector(".search");
// const input = document.querySelector(".input");
// const listOfNews = document.querySelector(".news-list");
// search.addEventListener("submit", retrieve)
// function retrieve(event) {
//     const apiKey =
// }

module.exports = router;

const router = require("express").Router();
const NewsAPI = require("newsapi");

router.get("/", (req, res) => {
  // res.send("news");

  const newsapi = new NewsAPI(process.env.API_KEY);

  newsapi.v2
    .everything({
      q: process.env.newsTopic,
      
      language: "en",
    
    })
    .then((data) => {
      
      res.render("post/news-thread", { article: data.articles });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("news-search", (req,res)=>{
  
})

module.exports = router;

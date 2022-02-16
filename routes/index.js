const router = require("express").Router();
const Post = require("../models/Post.model")
const NewsAPI = require("newsapi");



/* GET home page */
router.get("/", (req, res, next) => {
  let mixArr = [];


  Post.find().populate("author")
  .then(postsfromDb =>{
      // console.log(postsfromDb)
      mixArr = mixArr.concat(postsfromDb)
      
      // res.render("post/read-posts", {posts: postsfromDb})
  })

  const newsapi = new NewsAPI(process.env.API_KEY);

  newsapi.v2
  .everything({
    q: process.env.newsTopic,
    language: "en",
    
  })
  .then((data) => {
    mixArr = mixArr.concat(data.articles)
    
  
    mixArr.sort(function(a,b) {
      if (a.publishedAt < b.publishedAt) {
        return 1
      }
      if (a.publishedAt > b.publishedAt) {
        return -1
      }

    })
    return mixArr
    // res.render("post/news-thread", { article: data.articles });
  })
  .then(function(data) {
    res.render("index", {posts: data})
  })
  .catch((err) => {
    console.log(err);
  });


}); 

module.exports = router;

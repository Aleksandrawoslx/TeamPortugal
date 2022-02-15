const router = require("express").Router();
const NewsAPI = require('newsapi');

router.get("/", (req, res) =>{

    // res.send("news")

    const newsapi = new NewsAPI(process.env.API_KEY);

    newsapi.v2.everything({
        q: 'bitcoin',
        language: 'en',    
    })
    .then(data=>{
        console.log(data)
       res.render("post/news-thread")
    })


})





module.exports = router;
const Post = require("../models/Post.model");
const User =require("../models/User.model")

const router = require("express").Router();

router.get("/read-posts", (req,res,next)=>{
    Post.find()
    .then(postsfromDb =>{
        res.render("post/read-posts", {posts: postsfromDb})
    })
})

router.get("/create", (req,res,next)=>{
    res.render("post/new-post")
})

router.post("/create", (req,res,next)=>{
    const postDetails = {
        header: req.body.header,
        description: req.body.description,
        link: req.body.link,
        author: req.body.author
    }
    Post.create(postDetails)
    .then(post =>{
        res.redirect("/posts/read-posts")
    })
})







module.exports = router;
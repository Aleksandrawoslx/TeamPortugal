const Post = require("../models/Post.model");
const User =require("../models/User.model")
const isLoggedIn = require("../middleware/isLoggedIn");

const router = require("express").Router();

router.get("/read-posts", (req,res,next)=>{


    Post.find().populate("author")
    .then(postsfromDb =>{
        console.log(postsfromDb)
        res.render("post/read-posts", {posts: postsfromDb})
    })
})

router.get("/create",isLoggedIn, (req,res,next)=>{
    res.render("post/new-post")
})

router.post("/create",isLoggedIn, (req,res,next)=>{
    console.log(req.session)
    const postDetails = {
        header: req.body.header,
        description: req.body.description,
        link: req.body.link,
        author: req.session.user._id
    }
    Post.create(postDetails)
    .then(post =>{
        res.redirect("/posts/read-posts")
    })
})







module.exports = router;
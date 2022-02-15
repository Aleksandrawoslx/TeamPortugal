const router = require("express").Router();
const User = require("../models/User.model");

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/users/edit", isLoggedIn, (req, res) => {
  res.render("users/edit-profile", { userInSession: req.session.user });
});

/////
////////

router.get("users/:id/edit", (req, res, next) => {
  console.log("req.params 1:", req.params);
  User.findById(req.params.id)
    .then((userDetails) => {
      console.log("user to edit:", userDetails);
      res.render("users/edit-profile", { user: userDetails });
    })
    .catch((err) => {
      console.log("Error getting user details from DB...", err);
    });
});

router.post("/:id/edit", (req, res, next) => {
  console.log("req.params:", req.params);
  const { userId } = req.params;
  const { username, email, passwordHash } = req.body;
  User.findByIdAndUpdate(
    userId,
    { username, email, passwordHash },
    { new: true }
  )
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      console.log("Error updating profile...", err);
    });
});

router.post("users/:id/delete", (req, res, next) => {
  const { id } = req.params;
  console.log("req.params:", req.params);
  User.findByIdAndDelete(id)
    .then(() => {
      res.redirect("/signup");
      console.log("deleting profile successful");
    })
    .catch((err) => {
      console.log("Error deleting user...", err);
    });
});

////////
/////

module.exports = router;

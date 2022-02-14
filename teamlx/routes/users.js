const router = require("express").Router();
const User = require("../models/User.model");

/////
////////

router.get("/:userId/edit", (req, res, next) => {
  User.findById(req.params.userId)
    .then((userDetails) => {
      res.render("users/edit-profile", userDetails);
    })
    .catch((err) => {
      console.log("Error getting user details from DB...", err);
    });
});

router.post("/:userId/edit", (req, res, next) => {
  const userId = req.params.userId;

  const newDetails = {
    username: req.body.username,
    email: req.body.email,
    passwordHash: req.body.passwordHash, // just password??
  };

  User.findByIdAndUpdate(userId, newDetails)
    .then(() => {
      res.redirect("/profile"); // check this
    })
    .catch((err) => {
      console.log("Error updating profile...", err);
    });
});

router.post("/:userId/delete", (req, res, next) => {
  User.findByIdAndDelete(req.params.userId)
    .then(() => {
      res.redirect("/signup");
    })
    .catch((err) => {
      console.log("Error deleting user...", err);
    });
});

////////
/////

module.exports = router;

const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/register");
});

router.post("/signup", isLoggedOut, (req, res) => {
  console.log("The user has submitted this data:", req.body);
  const { username, email, password } = req.body;

  if (!username) {
    return res.status(400).render("auth/register", {
      errorMessage: "Please provide your username.",
    });
  }

  if (!email) {
    return res.status(400).render("auth/register", {
      errorMessage: "Please provide your email.",
    });
  }

  if (password.length < 8) {
    return res.status(400).render("auth/register", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  //   ! This use case is using a regular expression to control for special characters and min length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  */

  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth/register", { errorMessage: "Username already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        console.log("hashedpassword:", hashedPassword);
        // Create a user and save it in the database
        return User.create({
          username,
          email,
          passwordHash: hashedPassword,
        });
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;
        res.render("users/account-created");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/register", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/register", {
            errorMessage:
              "Username needs to be unique. The username you chose is already taken.",
          });
        }
        return res
          .status(500)
          .render("auth/register", { errorMessage: error.message });
      });
  });
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  console.log("the user has submitted this data:", req.body);
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Please provide your email." });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  // if (passwordHash.length < 8) {
  //   return res.status(400).render("auth/login", {
  //     errorMessage: "Your password needs to be at least 8 characters long.",
  //   });
  // }

  // Search the database for a user with the username submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).render("auth/login", {
          errorMessage: "Wrong credentials. Try again.",
        });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.passwordHash).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", { errorMessage: "Wrong credentials." });
        }
        req.session.user = user._id;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.get("/profile", isLoggedIn, (req, res) => {
  User.findById(req.session.user._id)
    .then((userDetails) => {
      res.render("users/user-profile", { userInSession: userDetails });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/edit-profile", isLoggedIn, (req, res) => {
  User.findById(req.session.user._id)
    .then((userDetails) => {
      res.render("users/edit-profile", { userInSession: userDetails });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/edit-profile", isLoggedIn, (req, res) => {
  const userId = req.session.user._id;
  const newDetails = {
    username: req.body.username,
    email: req.body.email,
  };
  User.findByIdAndUpdate(userId, newDetails, { new: true })
    .then(() => {
      console.log(userId + newDetails);
      res.render("users/updated");
    })
    .catch((err) => {
      console.log("Error updating user details:", err);
    });
});

router.post("/delete", isLoggedIn, (req, res) => {
  User.findByIdAndDelete(req.session.user._id)
    .then(() => {
      res.render("users/removed-profile");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render("/", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

module.exports = router;

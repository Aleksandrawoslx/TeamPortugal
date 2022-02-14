const router = require("express").Router();
const change = new Change
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;

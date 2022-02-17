module.exports = (req, res, next) => {
  res.locals.session = req.session.user;
  next();
};

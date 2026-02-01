const auth = (req, res, next) => {
  // require a session with either `user` object or `userId`
  if (!req.session || (!req.session.user && !req.session.userId)) {
    return res.status(401).json({ message: "Unauthorized - Please login first" });
  }

  // if only userId exists, create a minimal user object
  if (!req.session.user && req.session.userId) {
    req.session.user = { id: req.session.userId };
  }

  // if only user object exists, make sure userId is set too
  if (!req.session.userId && req.session.user) {
    req.session.userId = req.session.user.id || req.session.user._id;
  }

  // attach convenient shortcuts for downstream handlers
  req.user = req.session.user;
  req.userId = req.session.userId || (req.user && (req.user.id || req.user._id));

  next();
};

module.exports = auth;

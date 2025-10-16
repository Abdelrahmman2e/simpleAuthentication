const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const router = require("express").Router();
const authChecker = require("../middleware/authChecker");

router.get("/", authChecker, (req, res) => {
  res.render("profile", { user: req.user });
});

router.post("/", authChecker, async (req, res, nxt) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return nxt(new AppError("Invalid"));
  }
  req.user = user;
  res.render("profile", { user: req.user });
});

module.exports = router;

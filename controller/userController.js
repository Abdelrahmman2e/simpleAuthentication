const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function signJwtForUser(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    // httpOnly: true, // enable if you do not need JS access
    secure: false, // set true behind HTTPS only
    sameSite: "lax",
    maxAge: 3600000, // 1 hour
  });
}

exports.signUp = asyncHandler(async (req, res, nxt) => {
  const { username, email, password, passwordConfirm } = req.body;

  const currentUser = await User.findOne({ email });

  if (currentUser) {
    return nxt(new AppError(`User is already exist`, 400));
  }
  const user = await User.create({
    username,
    email,
    password,
    passwordConfirm,
  });
  const token = await signJwtForUser(user._id);
  setAuthCookie(res, token);

  res.redirect("/profile");
});

exports.login = asyncHandler(async (req, res, nxt) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return nxt(new AppError("Invalid email or password", 401));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return nxt(new AppError("Invalid email or password", 401));
  }

  const token = await signJwtForUser(user._id);
  setAuthCookie(res, token);

  req.user = user;

  res.redirect("/profile");
});

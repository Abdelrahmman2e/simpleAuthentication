const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async function authChecker(req, res, nxt) {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.redirect("/auth/login");
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) return res.redirect("/auth/login");
    req.user = user;
    return nxt();
  } catch (err) {
    return res.redirect("/auth/login");
  }
};

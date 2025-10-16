const router = require("express").Router();
const User = require("../models/userModel");

// Human-readable data deletion instructions page
router.get("/data-deletion", (req, res) => {
  res.render("dataDeletion");
});

// Optional self-serve deletion by email
router.post("/data-deletion", async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res
      .status(400)
      .render("dataDeletion", { message: "Email is required." });
  }
  await User.deleteOne({ email });
  res.clearCookie("token");
  return res
    .status(200)
    .render("dataDeletion", {
      message:
        "If an account existed for that email, it has been scheduled for deletion.",
    });
});

// Simple JSON endpoint describing how to request deletion (for programmatic reference)
router.get("/data-deletion.json", (req, res) => {
  res.json({
    instructionsUrl: "/legal/data-deletion",
    contactEmail: "support@example.com",
    note: "Submit the form on the instructions page to request deletion.",
  });
});

module.exports = router;

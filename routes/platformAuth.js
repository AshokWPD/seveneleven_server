const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Helper to send JWT after social login
function issueToken(user, res) {
  const token = jwt.sign({ id: user.id, type: user.type }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.redirect(`${process.env.FRONTEND_REDIRECT_URL}?token=${token}`);
}

// Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
  issueToken(req.user, res);
});

// Facebook
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }), (req, res) => {
  issueToken(req.user, res);
});

// Apple (optional)
router.get("/apple", passport.authenticate("apple"));
router.post("/apple/callback", passport.authenticate("apple", { failureRedirect: "/" }), (req, res) => {
  issueToken(req.user, res);
});

module.exports = router;

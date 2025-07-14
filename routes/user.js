import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import User from "../models/user.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import { renderSignupForm, signup, renderLoginForm, login, logout } from "../controllers/users.js";
import { render } from "ejs";
const router = express.Router();

router.route("/signup")
.get(renderSignupForm)
.post(
  wrapAsync(signup)
);

router.route("/login")
.get(renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login
);

router.get("/logout", logout );

export default router;

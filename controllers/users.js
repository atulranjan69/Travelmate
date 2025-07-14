import User from "../models/user.js";

const renderSignupForm = (req, res) => {
  res.render("users/signup", { title: "Sign Up" });
};

const renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
}


const signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Travelmate!");
      const redirectUrl = req.session.redirectUrl || "/listings";
      delete req.session.redirectUrl;
      res.redirect(redirectUrl);
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

const login = async (req, res) => {
    req.flash("success", "Welcome back to Travelmate! ");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }

  const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
}

export { signup, renderSignupForm, renderLoginForm, login, logout };

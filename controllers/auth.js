const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

login = (req, res) => {
  if (req.session.profile) {
    console.log(req.session.profile);
  }
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  let isLoggedIn = false;
  if (req.session.isLoggedIn) {
    isLoggedIn = true;
  }
  res.render("login", {
    pageTitle: "Login",
    isLoggedIn: isLoggedIn,
    user: req.session.AuthUser,
    errorMessage: message,
  });
};

postLogin = async (req, res) => {
  if (req.session.isLoggedIn) {
    isLoggedIn = true;
  }
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(404).json({ msg: "Please provide email and password" });
  }
  const user = await User.findOne({ email: email });
  if (user) {
    let hash = await bcrypt.compare(password, user.password);
    if (hash) {
      console.log("User Authorized");
      const userid = user._id;
      const token = jwt.sign({ userid, email }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      req.session.tooken = token;
      req.session.isLoggedIn = true;
      req.session.AuthUser = user.name;
      if (req.session.profile == true) {
        return res.redirect("/getProfile");
      } else {
        return res.redirect("/");
      }
    } else {
      console.log("Password not matched");

      return res.status(422).render("login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Invalid email or password",
        isLoggedIn: false,
        user: req.session.AuthUser,
      });
    }
  }
  if (!user) {
    return res.status(422).render("login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: "Invalid email or password",
      isLoggedIn: false,
      user: req.session.AuthUser,
    });
  }
};

signup = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  let isLoggedIn = false;
  if (req.session.isLoggedIn) {
    isLoggedIn = true;
  }
  res.render("signup", {
    pageTitle: "SignUp",
    isLoggedIn: isLoggedIn,
    user: req.session.AuthUser,
    errorMessage: message,
  });
};

postSignup = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    try {
      var hash = await bcrypt.hash(req.body.password, 12);
      var hashedPassword = hash;
    } catch (err) {
      console.log(err);
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phoneNum: req.body.phoneNum,
    });
    user.save();
    console.log("User Signed Up");
    res.redirect("./login");
  }

  if (user) {
    req.flash("error", "User Already Exist with this Email.");
    console.log("User Already Exist with this Email");
    res.redirect("./signup");
  }
};

logout = (req, res) => {
  req.session.destroy();
  console.log("USER LOGGED OUT");
  res.redirect("/");
};

module.exports = {
  login,
  logout,
  signup,
  postSignup,
};

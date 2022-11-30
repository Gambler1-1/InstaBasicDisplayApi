const Post = require("../models/post");
const axios = require("axios");

async function getIndex(req, res, next) {
  let isLoggedIn = false;
  if (req.session.isLoggedIn) {
    isLoggedIn = true;
  }
  try {
    res.render("home", {
      isLoggedIn: isLoggedIn,
      user: req.session.AuthUser,
      pageTitle: "Home",
    });
  } catch (error) {
    console.error(error);
    res.redirect("/auth/login");
  }
}

const getProfile = async (req, res) => {
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
  if (!req.session.isAuth == true) {
    return res.redirect("/login");
  }
  if (req.user) {
    var username = req.user.name;
  }
  let url = process.env.INSTA_URL;
  const response = await axios({
    url: url,
    method: "get",
  });
  let result = response.data.data;

  res.render("profile", {
    data: result,
    pageTitle: "Profile",
    isLoggedIn: isLoggedIn,
    user: req.session.AuthUser,
    errorMessage: message,
  });
};

const savepost = async (req, res) => {
  let isLoggedIn = false;
  if (req.session.isLoggedIn) {
    isLoggedIn = true;
  }
  if (!req.session.isAuth == true) {
    return res.redirect("/login");
  }
  const _id = req.params.id;

  let url = process.env.INSTA_URL;
  const response = await axios({
    url: url,
    method: "get",
  });
  let result = response.data.data;
  const result2 = result.filter((rslt) => rslt.id == _id);
  const rslt = { ...result2 };
  const caption = rslt[0].caption;
  const media_url = rslt[0].media_url;

  const saved = await Post.find({ caption: caption });
  console.log(saved);
  if (saved) {
    console.log("Post Already saved");
    req.flash("error", "Post Saved ");
    res.redirect("/getProfile");
  }

  const post = new Post({ caption, media_url });
  try {
    await post.save();
    console.log("Post Created");
    console.log(post);
    req.flash("error", "Post Saved Successfully");
    res.redirect("/getProfile");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getIndex,
  savepost,
  getProfile,
};

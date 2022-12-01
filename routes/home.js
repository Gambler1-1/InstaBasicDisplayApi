const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/is-auth");

const {
  getIndex,
  getProfile,
  savepost,
  modal,
} = require("../controllers/home");

router.route("/").get(getIndex);

router.route("/getProfile").get(isAuth, getProfile);

router.route("/savePost/:id").get(savepost);

router.route("/modal").get(modal);

module.exports = router;

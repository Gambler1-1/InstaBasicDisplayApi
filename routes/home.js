const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/is-auth");

const { getIndex, getProfile, savepost } = require("../controllers/home");

router.route("/").get(getIndex);

router.route("/getProfile").get(isAuth, getProfile);

router.route("/savePost/:id").get(savepost);

module.exports = router;

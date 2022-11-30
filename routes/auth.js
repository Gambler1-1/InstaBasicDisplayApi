const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const { check, body } = require("express-validator");

router.route("/login").get(auth.login);

router.post("/postlogin", postLogin);

router.route("/signup").get(auth.signup);
router.route("/post-signup").post(
  check("email").isEmail().withMessage("Please enter Valid Email Address"),
  body("password", "Please Enter password which is atleast 5 Characters long")
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords have to match");
    }
    return true;
  }),
  auth.postSignup
);

router.route("/logout").get(auth.logout);

module.exports = router;

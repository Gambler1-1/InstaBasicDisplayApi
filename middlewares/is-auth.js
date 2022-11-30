const jwt = require("jsonwebtoken");

isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/auth/login");
  }
  const tooken = req.session.tooken;
  const authHeader = `Bearer ${tooken}`;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.redirect("/auth/login");
  }

  const token = authHeader.split(" ")[1];
  console.log(token);
  console.log(`JWT ${process.env.JWT_SECRET}`);

  try {
    console.log(`TRY BLLLLLLLLLLLLL`);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const { userid, email } = decoded;
    console.log(userid, email);
    req.user = { userid, email };
    req.session.isAuth = true;
    // next();
  } catch (error) {
    return res.redirect("/auth/login");
  }

  next();
};
module.exports = isAuth;

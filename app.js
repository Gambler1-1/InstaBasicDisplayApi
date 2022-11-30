require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

const MONGODB_URI = process.env.MONGODB_URI;
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const path = require("path");
app.set("view engine", "ejs");
app.set("shop", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(flash());

// app.use((req, res, next) => {
//   console.log(req.session);
//   next();
// });

app.use(express.json());
//IMPORTING ROUTES
const homeRouter = require("./routes/home");
const authRouter = require("./routes/auth");

//USING ROUTES
app.use(homeRouter);
app.use("/auth", authRouter);

//NOT FOUND PAGE
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

//STARTING DEV SERVER
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server is listening on port ${process.env.PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();

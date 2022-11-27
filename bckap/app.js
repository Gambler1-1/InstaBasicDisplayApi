const mongoose = require('mongoose')
const express = require('express')
const app = express();
const session = require('express-session')
const bodyParser = require('body-parser');
const MongoDbStore = require('connect-mongodb-session')(session);
const user = require('./models/user')

// const csrf = require('csurf')
// const flash = require('connect-flash')
const flash = require('express-flash')

const multer = require('multer')
const passport = require('passport')

var initializePassport = require ('./passport-config')
initializePassport(
  passport,
  email => user.findOne({email: email}),
)



const MONGODB_URI = 'mongodb+srv://Agile_Falcon:Abdullah123@nodeexpressprojects.ub4ljvw.mongodb.net/ECOM?retryWrites=true&w=majority'
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

// const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination:(req, File, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null,  file.originalname);
  }
});


const path = require('path')
app.set('view engine', 'ejs');
app.set('shop', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ 
  secret: 'my secret',
  resave: false, 
  saveUninitialized: false, 
  store: store }))
app.use(passport.initialize())
app.use(passport.session())

// app.get('/login', (req, res)=> {
//   res.render('login')
// })
// app.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true,
// }))

app.use(multer({storage: fileStorage}).single('image'))
// app.use(csrfProtection);
app.use(flash());

const homeRouter = require('./routes/home')
const adminRouter = require('./routes/admin')
const authRouter = require('./routes/auth');
const { users } = require('moongose/models');

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(homeRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

app.use(express.json());

const port = 3000;

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();



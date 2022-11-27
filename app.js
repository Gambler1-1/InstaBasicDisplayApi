require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const express = require('express')
const app = express();
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session);
const user = require('./models/user')
const flash = require('express-flash')
const multer = require('multer')
const passport = require('passport')
// const csrf = require('csurf')

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
    cb(null,  Date.now()+ file.originalname);
  }
});
const fileFilter = (req, file, cb)=>{
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null,true)
  }else{
    cb(null,false)
  }
}

const path = require('path')
app.set('view engine', 'ejs');
app.set('shop', 'views');
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/images',express.static(path.join(__dirname,'images')))

app.use(session({ 
  secret: 'my secret',
  resave: false, 
  saveUninitialized: false, 
  store: store }))

// app.use(csrfProtection);
require ('./passport-config')
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

app.use(multer({storage: fileStorage , fileFilter: fileFilter}).single('image'))
app.use(flash());

app.use((req, res, next) => {
  // req.user ? res.locals.isAuthenticated=true : res.locals.isAuthenticated=false
  res.locals.isAdmin = false
  res.locals.isAuthenticated= false
if (req.user){
  res.locals.isAuthenticated=true 
  if(req.user.isAdmin){
    res.locals.isAdmin=true
  }
}

  // console.log(req.session.isLoggedIn)
  // res.locals.userId = req.session.passport.user
  // console.log(`Current User : ${req.user.name}`)
  
  // res.locals.csrfToken = req.csrfToken();
  // console.log(req.session)
  next();
});
const homeRouter = require('./routes/home')
const adminRouter = require('./routes/admin')
const authRouter = require('./routes/auth');
const { users } = require('moongose/models');

app.use(express.json());


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
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server is listening on port ${process.env.PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();



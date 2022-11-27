const path = require(`path`)
const bcrypt = require('bcryptjs')
const User = require("../models/user")
const session = require('express-session')
const { validationResult } = require('express-validator')



login = (req, res) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  }
  else {
    message = null;
  }
  res.render('login', {
    errorMessage: message,
    oldInput: {
      email:'',
      password:'',
      confirmPassword: ''
    }
  })
}

postLogin = async (req, res) => {
  const email = req.body.email;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('login', {
      errorMessage: errors.array()[0].msg
    })
  }
  let user = await User.findOne({ email: email })
  if (user) {
   
    let hash = await bcrypt.compare(req.body.password, user.password)
    if (hash) {
      console.log('User Authorized')
      req.session.isLoggedIn = true;
      return res.redirect('/')
    }
    else {
      req.flash('error', 'You Entered incorrect Password.')
      console.log('Password not matched')
      res.redirect('./login')
    }
  }
  else {
    req.flash('error', 'User with this Email does not exist. Please Signup first.')
    console.log('User with this Email does not exist')
    res.redirect('./signup')
  }
}

// postLogin = async (req, res) => {
//   const email = req.body.email;
//   User.findOne({ email: email }, function (err, user) {
//     if (err) {
//       console.log(err)
//       return res.redirect('./signup')
//     }
//     else if (user) {
//       const enteredPassword = req.body.password
//       const pass = user.password
//       bcrypt.compare(enteredPassword, user.password, function (err, matched) {
//         if (err) {
//           console.log(err)
//           res.redirect('./login')
//         }
//         if (matched) {
//           console.log('User Authorized')
//           req.session.isLoggedIn = true;
//           return res.redirect('/')
//         }
//         else {
//           console.log('Password not matched')
//           res.redirect('./login')
//         }
//       })
//     }
//     else {
//       console.log('User with this Email does not exist')
//       res.redirect('./signup')
//     }
//   })
// }


signup = (req, res) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  }
  else {
    message = null;
  }
  res.render('signup', {
    errorMessage: message,
    oldInput:{
      name: '',
      email : '',
      password : '',
      confirmPassword: '',
      phoneNum:''
  }
  })

}

postSignup = async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('signup', {
      errorMessage: errors.array()[0].msg,
      oldInput:{
        name: req.body.name,
        email : req.body.email,
        password : req.body.password,
        confirmPassword: req.body.confirmPassword,
        phoneNum: req.body.phoneNum
    }
    })
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log(err);
    }
    else if (user) {
      req.flash('error', 'User Already Exist with this Email.')
      console.log('User Already Exist with this Email')
      res.redirect('./signup')
    }
    else {

      bcrypt.hash(req.body.password, 12, function (err, hash) {
        if (err) {
          console.log("Enc Failed")
        }
        const hashedPassword = hash
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          phoneNum: req.body.phoneNum
        });
        try {
          user.save();
          console.log('User Signed Up')
          res.redirect('./login')

        } catch (error) {
          res.status(500).send(error);
        }
      });

    }
  }
  )
}

logout = (req, res) => {
  req.session.destroy();
  console.log("USER LOGGED OUT")
  res.redirect('/');
}

module.exports = {
  login,
  logout,
  signup,
  postSignup,
  postLogin,
}

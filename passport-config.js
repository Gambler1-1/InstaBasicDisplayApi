var passport = require('passport')
const bcrypt = require('bcryptjs')
const flash = require('express-flash')
const User = require('./models/user')




var LocalStrategy = require('passport-local').Strategy
const { Passport } = require('passport')

const customFields = {
    usernameField: 'email',
    passwordField: 'password'

};

const verifyCallback = async (email, password, done) => {

try {
    const user = await User.findOne({ email: email })
    if (!user) {
        console.log('No User with this Email')

        return done(null, false ,{errorMessage: 'no user with this email'})
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {

        console.log('password matched');
        
        return done(null, user)
    }
    else {

        console.log('password not matched')

        return done(null, false), flash('error', 'You Entered incorrect Password.')

    }
    
} catch (error) {
    done(error)
    
}
    
}

const strategy = new LocalStrategy(customFields , verifyCallback)

passport.use(strategy)

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  User.findById(_id, function (err, user) {
    done(err, user);
  });
});

// passport.serializeUser((user, done) => {
//     done (null, user._id);
// });

// passport.deserializeUser(async (email, done) =>{
//     try{
//         const user =await User.findOne({email:email})
//     if(user){
//         done( null, user);
//     }
//     }
//     catch(err){
//         done(err)
//     } 
// })





const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')
const { check, body } = require('express-validator')
const passport = require('passport')



router.route('/login').get(auth.login)
// router.route('/post-login')
//     .post(check('email')
//         .isEmail()
//         .withMessage('Please enter Valid Email Address'), auth.postLogin)
// router.route('/post-login' , passport.authenticate('local')).post(auth.postLogin)
router.post('/login', 
  passport.authenticate('local', {
    
    failureRedirect: './login',
    successRedirect: '/',
failureFlash: true ,

}

)
);
        

router.route('/signup').get(auth.signup)
router.route('/post-signup')
    .post(check('email')
        .isEmail()
        .withMessage('Please enter Valid Email Address'),
        body('password', 'Please Enter password which is atleast 5 Characters long')
            .isLength({ min: 5 })
            .isAlphanumeric(),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match');
            }
            return true;
        }), auth.postSignup)



router.route('/logout').get(auth.logout)

// router.route('/post-add-product').post(postAddProduct)

module.exports = router


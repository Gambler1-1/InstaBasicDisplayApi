let user = await User.findOne({ email: email }); 
let hash = await bcrypt.compare(enteredPassword, user.password)

If (user) { 
    req.session.isLoggedIn = false;
    res.redirect('/login');
} else if (hash) {
    // Logic goes here
} else {
    // Logic goes here
}




postLogin = async (req, res) => {
    const email = req.body.email;
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        console.log(err)
        return res.redirect('./signup')
      }
      else if (user) {
        const enteredPassword = req.body.password
        const pass = user.password
        bcrypt.compare(enteredPassword, user.password, function (err, matched) {
          if (err) {
            console.log(err)
            res.redirect('./login')
          }
          if (matched) {
            console.log('User Authorized')
            req.session.isLoggedIn = true;
            return res.redirect('/')
          }
          else {
            console.log('Password not matched')
            res.redirect('./login')
          }
        })
      }
      else {
        console.log('User with this Email does not exist')
        res.redirect('./signup')
      }
    })
  }
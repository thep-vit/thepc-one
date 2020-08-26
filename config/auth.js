module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      // req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/users/login');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/dashboard');      
    },
    isAdmin: (req, res, next) => {
      if(req.user.memberType == 1){
        return next();
      }else{
        res.send("You are not an administrator!!").status(401);
      }
    }
  };
  


  //Error types:
  //Access hierarchy error: 401
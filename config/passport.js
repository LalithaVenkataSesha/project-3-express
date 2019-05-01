var LocalStrategy = require('passport-local').Strategy;

// Load db 
var db = require('../models');


module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });


  /*
    
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    db.User.findByPk(id, function(err, user) {
      done(err, user);
    });
  });
  
  
  */


  //signup
  passport.use("local-signup", new LocalStrategy({
    // by default, local strategy uses username and local_pw, we will override with email
    usernameField: "email",
    passwordField: "passw",
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },

    function (req, email, passw, done) {
      //for debugging
      console.log(req.body)
      console.log(email)
      console.log(passw)

      
      process.nextTick(function () {
        db.users.findOne({
          where: {
            email: email
          }
        }).then(function (user, err) {
          console.log("Hi User", user)
          
          //if email is already registered
          if (user) {
            console.log("user &&&&&&&&&&&&&&&&&&&", user)
            return done(null, false, { 
              from: "signup",
              message: 'This email is already registered.' 
            });
          } else {
            //creating a new account in our database
            console.log("user ######", user)
            db.users.create({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: email,
              phone: req.body.phone,
              city: req.body.city,
              state: req.body.state,
              passw: db.users.generateHash(passw)
            }).then(function (newUser) {
              console.log("new user", newUser)
              return done(null, newUser)
            }).catch(err => console.log(err))
          }
        })
      })

    }))




  passport.use("local-signin",
    // instead of using default username field, replace email for the username field verification
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: "passw",
        passReqToCallback: true
        // allows us to pass back the entire request to the callback
      }, function (req, email, passw, done) {
        // Match user
        db.users.findOne({where:{
          email: email,

        }}).then(function (user, err) {
          
          // if there are any errors, return the error before anything else
          if (err) {
            console.log("err ^^^^^^^^^^^^", err);
            return done(err);
          }
          // if no user is found, return the message
          if (!user) {
            console.log("$$$$$$$$$", !user)
            return done(null, false, { 
              from: 'login',
              message: 'Incorrect email/ password combination.'
            }); // req.flash is the way to set flashdata using connect-flash
          }
          // if the user is found but the password is wrong
          if (user && !user.compareHash(req.body.passw)) {
            console.log('%%^^^^%$%$%%wrong password', user, err)
            return done(null, false, { 
              from: 'login',
              message: 'Incorrect email/ password combination.'
            }); // create the loginMessage and save it to session as flashdata
          }
          // all is well, return successful user
          console.log("logging in @@@@@@@@@@@@@@@@", user)
          return done(null, user);

        });
      })
  );




};

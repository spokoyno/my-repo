const express = require('express');
const passport = require('passport');
const IntercomStrategy = require('passport-intercom').Strategy;
const Intercom = require('intercom-client');

const app = express();
const intercom = new Intercom.Client({ token: 'dG9rOjgyNWRjZjg0XzFhZjVfNDI1M19iZDM3X2E4ZGM5NmI1MTYwYzoxOjA=' });

passport.use(new IntercomStrategy({
  clientID: '2a5d8009-e000-4c17-83e5-3decbb3f6a3f',
  clientSecret: '4858ff34-10d9-4f73-9362-52da18046da1',
  callbackURL: "https://replit.com/@krasnobai13/test#index.js"
},
  function(accessToken, refreshToken, profile, done) {
    // Find or create the user in your database here
    // For example, you could use a User.findOrCreate method
    User.findOrCreate({ intercomAdminId: profile.id }, function(err, user) {
      return done(err, user);
    });
  }
));

// Initialize Passport and restore authentication state
app.use(passport.initialize());
app.use(passport.session());

// Route to begin the OAuth flow
app.get('/auth/intercom', passport.authenticate('intercom'));

// Callback route that Intercom redirects to
app.get('/auth/intercom/callback', passport.authenticate('intercom', { failureRedirect: '/login' }), (req, res) => {
  // Successful authentication, send a message on the user's behalf
  intercom.messages.create({
    body: 'Hi',
    from: { type: 'admin', id: req.user.intercomAdminId },
    to: { type: 'user', id: req.user.intercomUserId }
  });
  res.redirect('/');
});

app.listen(3000, () => console.log('Server started on port 3000'));

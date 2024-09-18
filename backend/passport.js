var GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");

const GOOGLE_CLIENT_ID =
  "1047219889556-1is8lcenvmgurrous1m1s40fha3eiqf8.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://yourdomain:3000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      const user = {
        username: profile.displayName,
      };
      user.save();
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

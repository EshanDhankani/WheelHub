// const GoogleStrategy = require("passport-google-oauth2").Strategy;
// const FormDataModel = require("../backend/models/FormData");

// module.exports = (passport) => {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_SECRET_ID,
//         callbackURL: "http://localhost:3001/auth/google/callback",
//         scope: ["profile", "email"],
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           let user = await FormDataModel.findOne({ googleId: profile.id }) ||
//                      await FormDataModel.findOne({ email: profile.email });
          
//           if (!user) {
//             user = await new FormDataModel({
//               googleId: profile.id,
//               name: `${profile.given_name} ${profile.family_name}`,
//               email: profile.email,
//             }).save();
//           } else if (!user.googleId) {
//             user.googleId = profile.id;
//             await user.save();
//           }
          
//           return done(null, user);
//         } catch (err) {
//           return done(err, null);
//         }
//       }
//     )
//   );

//   passport.serializeUser((user, done) => done(null, user.id));
//   passport.deserializeUser((id, done) => {
//     FormDataModel.findById(id, (err, user) => done(err, user));
//   });
// };


// const GoogleStrategy = require("passport-google-oauth2").Strategy;
// const FormDataModel = require("../backend/models/FormData");

// module.exports = (passport) => {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.CLIENT_ID, // Use environment variables
//         clientSecret: process.env.SECRET_ID,
//         callbackURL: "http://localhost:3001/auth/google/callback",
//         passReqToCallback: true,
//       },
//       async (request, accessToken, refreshToken, profile, done) => {
//         try {
//           let user = await FormDataModel.findOne({ googleId: profile.id });

//           if (!user) {
//             user = new FormDataModel({
//               googleId: profile.id,
//               email: profile.email,
//               name: profile.displayName,
//             });
//             await user.save();
//           }

//           return done(null, user);
//         } catch (error) {
//           return done(error, null);
//         }
//       }
//     )
//   );

//   passport.serializeUser((user, done) => done(null, user.id));
//   passport.deserializeUser((id, done) => {
//     FormDataModel.findById(id, (err, user) => done(err, user));
//   });
// };


// const GoogleStrategy = require("passport-google-oauth2").Strategy;
// const FormDataModel = require("../backend/models/FormData");

// module.exports = (passport) => {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.CLIENT_ID, // Loaded from .env
//         clientSecret: process.env.SECRET_ID, // Loaded from .env
//         callbackURL: "http://localhost:3001/auth/google/callback",
//         passReqToCallback: true,
//       },
//       async (request, accessToken, refreshToken, profile, done) => {
//         try {
//           let user = await FormDataModel.findOne({ googleId: profile.id });

//           if (!user) {
//             user = new FormDataModel({
//               googleId: profile.id,
//               email: profile.email,
//               name: profile.displayName,
//             });
//             await user.save();
//           }

//           return done(null, user);
//         } catch (error) {
//           return done(error, null);
//         }
//       }
//     )
//   );

//   passport.serializeUser((user, done) => done(null, user.id));
//   passport.deserializeUser((id, done) => {
//     FormDataModel.findById(id, (err, user) => done(err, user));
//   });
// };


const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FormDataModel = require("../backend/models/FormData");


if (!process.env.CLIENT_ID || !process.env.SECRET_ID) {
  throw new Error("Missing CLIENT_ID or SECRET_ID in environment variables.");
}

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID, // Environment variable for client ID
        clientSecret: process.env.SECRET_ID, // Environment variable for client secret
        callbackURL: "http://localhost:3001/auth/google/callback", // Callback URL
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          let user = await FormDataModel.findOne({ googleId: profile.id });

          if (!user) {
            user = new FormDataModel({
              googleId: profile.id,
              email: profile.email,
              name: profile.displayName,
            });
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    FormDataModel.findById(id, (err, user) => done(err, user));
  });
};

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const CarAdModel = require("./models/CarAd");
const FormDataModel = require("./models/FormData");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const multer = require("multer");
const path = require("path");

const client_id =
  "467364977483-n6ace55lvjoif05bjv4enqbusb91clir.apps.googleusercontent.com";
const secret_id = "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";
const app = express();

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

mongoose.connect("mongodb://127.0.0.1:27017/WheelHub");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(
  session({
    secret: "1523675367asghjefdAdcav",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/carAds", async (req, res) => {
  try {
    const carAds = await CarAdModel.find();
    res.json(carAds);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});

app.post("/postAd", upload.array("images", 3), async (req, res) => {
  try {
    const {
      city,
      carInfo,
      registeredIn,
      exteriorColor,
      mileage,
      price,
      adDescription,
      mobileNumber,
    } = req.body;
    const images = req.files.map((file) => file.path);

    const newAd = new CarAdModel({
      city,
      carInfo,
      registeredIn,
      exteriorColor,
      mileage,
      price,
      adDescription,
      mobileNumber,
      images,
    });

    await newAd.save();
    res.status(201).json({ message: "Ad posted successfully", ad: newAd });
  } catch (error) {
    res.status(500).json({ message: "Error posting ad", error: error.message });
  }
});

app.post("/register", (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  console.log("Registering user:", { firstName, lastName, email, password });

  // Check if user with the given email already exists
  FormDataModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        console.log("User already registered");
        res.json("Already registered");
      } else {
        // Create a new user document in MongoDB
        FormDataModel.create({ email, password, firstName, lastName })
          .then((log_reg_form) => {
            console.log("User registered successfully:", log_reg_form);
            res.json(log_reg_form); // Return success response
          })
          .catch((err) => {
            console.error("Error registering user:", err);
            res
              .status(500)
              .json({ message: "Error registering user", error: err.message });
          });
      }
    })
    .catch((error) => {
      console.error("Database error:", error);
      res.status(500).json({ message: "Database error", error: error.message });
    });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  FormDataModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        req.session.user = user;
        res.json("Success");
      } else {
        res.json("Wrong password");
      }
    } else {
      res.json("No records found!");
    }
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error logging out", error: err.message });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

app.get("/currentUser", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.put("/updateProfile", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const { firstName, lastName, email, password } = req.body; // Destructure updated data from request body

    // Find the user by session user ID and update their profile
    const updatedUser = await FormDataModel.findByIdAndUpdate(
      req.session.user._id, // Use the ID stored in session
      { firstName, lastName, email, password }, // Fields to update
      { new: true, runValidators: true } // Return updated document and validate inputs
    );

    // Update the session with the new user data
    req.session.user = updatedUser;

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

////

app.delete("/deleteProfile", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // Find the user by session ID and delete them
    await FormDataModel.findByIdAndDelete(req.session.user._id);

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out", error: err.message });
      }

      // Clear the session cookie
      res.clearCookie("connect.sid");
      res.json({ message: "Profile deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile", error: error.message });
  }
});

/////

app.get("/carAds/:id", async (req, res) => {
  try {
    const carAd = await CarAdModel.findById(req.params.id);
    if (!carAd) {
      return res.status(404).json({ message: "Car ad not found" });
    }
    res.json(carAd);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});

passport.use(
  new OAuth2Strategy(
    {
      clientID: client_id,
      clientSecret: secret_id,
      callbackURL: "http://localhost:3001/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if a user already exists with this Google ID
        let user = await FormDataModel.findOne({ googleId: profile.id });

        if (!user) {
          // If no user is found with Google ID, check by email
          user = await FormDataModel.findOne({ email: profile.email });

          if (user) {
            // If a user exists with the same email, but without googleId, update the user
            user.googleId = profile.id;
            await user.save();
            console.log("Existing user found by email, updated googleId.");
          } else {
            // If no user exists with that email, create a new one
            const fullName = `${profile.name.givenName} ${profile.name.familyName}`;
            user = new FormDataModel({
              googleId: profile.id,
              name: fullName,
              email: profile.email,
              // No password needed for Google users
            });
            await user.save();
            console.log("New user created with Google login.");
          }
        }

        return done(null, user); // Log the user in
      } catch (error) {
        console.error("Error during Google OAuth:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    req.session.user = req.user; // Save the user in session after Google login
    res.redirect("http://localhost:5173/UsedCars");
  }
);

app.listen(3001, () => {
  console.log("Server listening on http://127.0.0.1:3001");
});

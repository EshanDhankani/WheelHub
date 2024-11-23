const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const CarAdModel = require("./models/CarAd");
const AccessoryAdModel = require("./models/AccessoryAd");
const FormDataModel = require("./models/FormData");
const MessageModel = require("./models/Message");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const ResetToken = require("./models/ResetPassword");

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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "eshankumar037@gmail.com",
    pass: "ozgz rweg rcvk aoxx",
  },
});

async function sendVerificationEmail(email, token) {
  const mailOptions = {
    from: '"WheelHub Support" <eshankumar037@gmail.com>',
    to: email,
    subject: "Verify your email",
    text: `Click the following link to verify your email: http://localhost:3001/verify-email?token=${token}`,
    html: `<p>Click the following link to verify your email:</p><a href="http://localhost:3001/verify-email?token=${token}">Verify Email</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to", email);
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
}

app.post("/messages", upload.array("images", 8), async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { carAdId, receiverId, message, fontColor, fontSize, fontStyle } =
    req.body;
  const imageUrls = req.files.map(
    (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
  );

  try {
    const newMessage = new MessageModel({
      senderId: req.session.user._id,
      receiverId,
      carAdId,
      message,
      fontColor,
      fontSize,
      fontStyle,
      imageUrl: imageUrls, // Store array of image URLs
      isSeen: false,
    });

    const savedMessage = await newMessage.save();
    res
      .status(201)
      .json({ message: "Message sent successfully", newMessage: savedMessage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
});

// app.get("/messages/:carAdId", async (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Not authenticated" });
//   }

//   const { carAdId } = req.params;

//   try {
//     const messages = await MessageModel.find({ carAdId })
//       .populate("senderId", "name email")
//       .populate("receiverId", "name email");
//     res.status(200).json(messages);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching messages", error: error.message });
//   }
// });

app.get("/messages/:carAdId", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { carAdId } = req.params;

  try {
    const messages = await MessageModel.find({ carAdId })
      .populate("senderId", "name email")
      .populate("receiverId", "name email");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
});


// Endpoint to update the message status to "seen"
app.put("/messages/seen/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { isSeen: true },
      { new: true }
    );
    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message marked as seen", updatedMessage });
  } catch (error) {
    res.status(500).json({ message: "Error updating message", error: error.message });
  }
});



app.get("/carAds", async (req, res) => {
  try {
    console.log("Fetching car ads...");
    const carAds = await CarAdModel.find();
    console.log("Car ads fetched:", carAds);
    res.json(carAds);
  } catch (error) {
    console.error("Error fetching car ads:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching car ads", error: error.message });
  }
});

app.post("/postAd", upload.array("images", 3), async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const {
      city,
      carInfo,
      year,
      registeredIn,
      exteriorColor,
      mileage,
      price,
      adDescription,
      mobileNumber,
    } = req.body;
    const images = req.files.map((file) => file.path);

    const newAd = new CarAdModel({
      userId: req.session.user._id,
      city,
      carInfo,
      year,
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

app.post("/postAccessoryAd", upload.array("images", 3), async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const {
      city,
      accessoryInfo,
      category,
      condition,
      price,
      accessoryDescription,
      mobileNumber,
    } = req.body;
    console.log("Form data:", req.body);
    console.log("Uploaded files:", req.files);

    const images = req.files.map((file) => file.path);

    const newAccessoryAd = new AccessoryAdModel({
      userId: req.session.user._id,
      city,
      accessoryInfo,
      category,
      condition,
      price,
      accessoryDescription,
      mobileNumber,
      images,
    });

    await newAccessoryAd.save();
    res.status(201).json({
      message: "Accessory ad posted successfully",
      ad: newAccessoryAd,
    });
  } catch (error) {
    console.error("Error posting accessory ad:", error.message);
    res
      .status(500)
      .json({ message: "Error posting accessory ad", error: error.message });
  }
});

app.get("/myAds", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const carAds = await CarAdModel.find({ userId: req.session.user._id });
    const accessoryAds = await AccessoryAdModel.find({
      userId: req.session.user._id,
    });

    res.json({
      message: "Success",
      carAds: carAds,
      accessoryAds: accessoryAds,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching ads", error: error.message });
  }
});

app.get("/api/accessories", async (req, res) => {
  try {
    const accessories = await AccessoryAdModel.find();
    res.json(accessories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching accessories", error });
  }
});

app.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    let user = await FormDataModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Already registered" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new FormDataModel({
      email,
      password,
      name: `${firstName} ${lastName}`,
      verified: false,
      verificationToken,
    });

    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user: newUser,
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "Email is already registered" });
    } else {
      console.error("Error registering user:", err.message);
      res
        .status(500)
        .json({ message: "Error registering user", error: err.message });
    }
  }
});

app.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const user = await FormDataModel.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying email", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await FormDataModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No records found!" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    if (!user.verified) {
      return res.status(403).json({
        message:
          "Email not verified. Please verify your email before logging in.",
      });
    }

    req.session.user = user;
    res.status(200).json("Success");
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
});

app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await FormDataModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    await new ResetToken({ userId: user._id, token }).save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;
    await transporter.sendMail({
      from: '"WheelHub Support" <eshankumar037@gmail.com>',
      to: user.email,
      subject: "Password Reset Link",
      html: `<p>Please click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });

    res.json({ message: "Password reset link sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    const resetToken = await ResetToken.findOne({ token });

    if (!resetToken) {
      console.log("Invalid or expired token");
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const user = await FormDataModel.findById(resetToken.userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    await user.save();

    await ResetToken.deleteOne({ _id: resetToken._id });

    console.log("Password updated successfully for user:", user.email);
    return res
      .status(200)
      .json({ message: "Your password has been updated successfully!" });
  } catch (error) {
    console.error("Server error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.json({ message: "Logged out successfully" });
  });
});

app.get("/currentUser", (req, res) => {
  console.log("Current session user:", req.session.user);
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
    const { firstName, lastName, password } = req.body;
    const name = `${firstName} ${lastName}`;

    const updatedUser = await FormDataModel.findByIdAndUpdate(
      req.session.user._id,
      { name, ...(password && { password }) },
      { new: true, runValidators: true }
    );

    req.session.user = updatedUser;

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

app.delete("/deleteProfile", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    await FormDataModel.findByIdAndDelete(req.session.user._id);

    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error logging out", error: err.message });
      }

      res.clearCookie("connect.sid");
      res.json({ message: "Profile deleted successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting profile", error: error.message });
  }
});

app.get("/carAds/:id", async (req, res) => {
  try {
    const carAd = await CarAdModel.findById(req.params.id).populate(
      "userId",
      "name"
    );
    if (!carAd) {
      return res.status(404).json({ message: "Car ad not found" });
    }
    res.json(carAd);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching car ad", error: error.message });
  }
});

app.put("/carAds/:id", async (req, res) => {
  try {
    const updatedAd = await CarAdModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updatedAd);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating car ad", error: error.message });
  }
});

app.delete("/carAds/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAd = await CarAdModel.findByIdAndDelete(id);

    if (!deletedAd) {
      return res.status(404).json({ message: "Car ad not found" });
    }

    res.json({ message: "Ad deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting car ad", error: error.message });
  }
});

app.put("/accessoryAds/:id", upload.array("images", 3), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      city,
      accessoryInfo,
      category,
      condition,
      price,
      accessoryDescription,
      mobileNumber,
    } = req.body;

    const images =
      req.files.length > 0
        ? req.files.map((file) => file.path)
        : req.body.images;

    const updatedAd = await AccessoryAdModel.findByIdAndUpdate(
      id,
      {
        city,
        accessoryInfo,
        category,
        condition,
        price,
        accessoryDescription,
        mobileNumber,
        images,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAd) {
      return res.status(404).json({ message: "Accessory ad not found" });
    }
    res.json({ message: "Ad updated successfully", ad: updatedAd });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating accessory ad", error: error.message });
  }
});

app.delete("/accessoryAds/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAd = await AccessoryAdModel.findByIdAndDelete(id);

    if (!deletedAd) {
      return res.status(404).json({ message: "Accessory ad not found" });
    }

    res.json({ message: "Ad deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Accessory ad", error: error.message });
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
        let user = await FormDataModel.findOne({ googleId: profile.id });

        if (!user) {
          user = await FormDataModel.findOne({ email: profile.email });

          if (user) {
            user.googleId = profile.id;
            await user.save();
            console.log("Existing user found by email, updated googleId.");
          } else {
            const fullName = `${profile.name.givenName} ${profile.name.familyName}`;
            user = new FormDataModel({
              googleId: profile.id,
              name: fullName,
              email: profile.email,
            });
            await user.save();
            console.log("New user created with Google login.");
          }
        }

        return done(null, user);
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
    req.session.user = req.user;
    res.redirect("http://localhost:5173/UsedCars");
  }
);

app.listen(3001, () => {
  console.log("Server listening on http://127.0.0.1:3001");
});




//////////////////////

// require('dotenv').config();
// const cors = require('cors');
// const express = require('express');
// const connectDB = require('../config/db');
// const userRoutes = require('./routes/authRoutes');
// const carAdRoutes = require('../backend/routes/carAdRoutes')

// const path = require('path');

// // Middleware
// const app = express();
// app.use(express.json());
// const port = process.env.PORT || 5000;
// connectDB();

// app.use(cors());

// app.use('/api/users', userRoutes);
// app.use('/api/car', carAdRoutes);

// app.listen(port, () => console.log(`Server running on port ${port}`));

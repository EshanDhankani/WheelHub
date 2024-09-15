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


const client_id = "467364977483-n6ace55lvjoif05bjv4enqbusb91clir.apps.googleusercontent.com";
const secret_id = "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";
const app = express();

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


mongoose.connect("mongodb://127.0.0.1:27017/WheelHub");
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log("Connected to MongoDB successfully");
//   console.log("Database name:", mongoose.connection.name);
//   console.log("Host:", mongoose.connection.host);
//   console.log("Port:", mongoose.connection.port);
// })
// .catch(err => console.error("MongoDB connection error:", err));


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
    resave:false,
    saveUninitialized: true,
    cookie:{
      secure:false,maxAge: 24 * 60 * 60 *1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.get("/carAds", async (req, res) => {
  console.log("Received request for /carAds");
  try {
   
    console.log("Fetching car ads from database");
    const carAds = await CarAdModel.find();
    console.log(`Found ${carAds.length} car ads`);
    console.log("First car ad:", carAds[0]);
    res.json(carAds);
  } catch (error) {
    console.error("Error fetching car ads:", error);
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
    console.error("Error posting ad:", error);
    res.status(500).json({ message: "Error posting ad", error: error.message });
  }
});


app.post("/register", (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const name = `${firstName} ${lastName}`;

  FormDataModel.findOne({ email: email }).then((user) => {
    if (user) {
      res.json("Already registered");
    } else {
      FormDataModel.create({ email, password, name })
        .then((log_reg_form) => res.json(log_reg_form))
        .catch((err) => res.json(err));
    }
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
      res.json("No records found! ");
    }
  });
});

app.get("/currentUser", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});








app.get("/carAds/:id", async (req, res) => {
  try {
    const carAd = await CarAdModel.findById(req.params.id);
    if (!carAd) {
      return res.status(404).json({ message: "Car ad not found" });
    }
    res.json(carAd);
  } catch (error) {
    console.error("Error fetching car ad:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});











passport.use(
  new OAuth2Strategy(
    {
      clientID: client_id,
      clientSecret: secret_id,
      // callbackURL: "/auth/google/callback",
      callbackURL: "http://localhost:3001/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await FormDataModel.findOne({ googleId: profile.id });
        if (!user) {
          // const fullName = await FormDataModel.findOne({ googleId:profile.id})
          const fullName = `${profile.name.givenName} ${profile.name.familyName}`;
           user = new FormDataModel({
            googleId: profile.id,
            // name: profile.name,
            name:fullName,

            email: profile.email,
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
  passport.authenticate("google",{
    // successRedirect:"https://localhost:5173/UsedCars",
    // failureRedirect:"https://localhost:5173/login",
    successRedirect: "http://localhost:5173/UsedCars",
    failureRedirect: "http://localhost:5173/login",

  })
);



app.listen(3001, ()=>{
  console.log("Server listening on http://127.0.0.1:3001");
});
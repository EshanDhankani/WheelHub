// const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/WheelHub", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => console.log("Connected to MongoDB"));

// module.exports = mongoose;


// const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/WheelHub", {
//   // No need for useNewUrlParser or useUnifiedTopology in newer drivers
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => console.log("Connected to MongoDB"));

// module.exports = mongoose;





// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/WheelHub", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true, // These options ensure compatibility with older drivers.
//     });
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     process.exit(1); // Exit the process with failure
//   }
// };

// module.exports = connectDB;





// db/conn.js

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/WheelHub';

// Check if dbURI is correctly set
if (!dbURI) {
  throw new Error('MONGO_URI is not defined in .env file');
}

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB connected');
  } catch (error) {
    console.error('Error connecting to DB:', error.message);
    process.exit(1); // Exit with failure if DB connection fails
  }
};

module.exports = connectDB;
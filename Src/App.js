const express = require("express");
const ConnectDB = require("./Config/database");
const User = require("./models/user");
const { Signupvalidation } = require("./Utiles/Signupvalidation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const App = express();
const authRouter = require("./Routes/Auth");
const profileRouter = require("./Routes/Profile");
const requestrouter = require("./Routes/request");

// Middlewares
App.use(express.json());
App.use(cookieParser());

// FEED API
// App.get("/feed", async (req, res) => {
//   try {
//     const allUsers = await User.find().select("-password");
//     res.send(allUsers);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// // FIND USER BY EMAIL
// App.get("/user", async (req, res) => {
//   try {
//     const { emailId } = req.body;
//     const users = await User.find({ emailId });

//     if (users.length === 0) {
//       return res.status(404).send("User Not Found");
//     }

//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// // DELETE USER BY ID
// App.delete("/user", async (req, res) => {
//   try {
//     const { userID } = req.body;
//     await User.findByIdAndDelete(userID);
//     res.send("User deleted successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// // UPDATE USER (Only allowed fields)
// App.patch("/user/:userID", async (req, res) => {
//   try {
//     const userID = req.params.userID;
//     const data = req.body;

//     const ALLOWED = ["firstName", "gender", "emailId", "password"];
//     const isValid = Object.keys(data).every((key) => ALLOWED.includes(key));

//     if (!isValid) {
//       throw new Error("User cannot be updated with invalid fields");
//     }

//     await User.findByIdAndUpdate(userID, data, { runValidators: true });
//     res.send("User updated successfully");
//   } catch (err) {
//     res.status(400).send("Update Failed: " + err.message);
//   }
// });



// CONNECT TO DATABASE AND START SERVER
ConnectDB()
  .then(() => {
    console.log("Connected to the database");
    App.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

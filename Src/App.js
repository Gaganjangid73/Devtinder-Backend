const express = require("express");
const ConnectDB = require("./Config/database");
const User = require("./models/user");
const { Signupvalidation } = require("./Utiles/Signupvalidation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
const userAuth = require("./middleware/userauth");

const App = express();

// Middlewares
App.use(express.json());
App.use(cookieParser());

// SIGNUP API


//LOGIN API (JWT issued here)
App.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const LoginUser = await User.findOne({ emailId });
    if (!LoginUser) throw new Error("Email ID not found in DB");

    const isPasswordValid = await bcrypt.compare(password, LoginUser.password);
    if (!isPasswordValid) throw new Error("Incorrect password");

    // Issue token
    const token = JWT.sign({ _id: LoginUser._id }, "uhurvhufrbv", {
      expiresIn: "1h",
    });

    res.cookie("token", token,);

    res.send("User login successful");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//  GET PROFILE (using token from cookies)
App.get("/profile",userAuth, async (req, res) => {
  try {
    res.send(req.user); // gwt user profile of login user 
  } catch (err) {
    // console.error("Error in /profile:", err.message);
    res.status(401).send("Unauthorized: " + err.message);
  }
});

// FEED API
App.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find().select("-password");
    res.send(allUsers);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// FIND USER BY EMAIL
App.get("/user", async (req, res) => {
  try {
    const { emailId } = req.body;
    const users = await User.find({ emailId });

    if (users.length === 0) {
      return res.status(404).send("User Not Found");
    }

    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// DELETE USER BY ID
App.delete("/user", async (req, res) => {
  try {
    const { userID } = req.body;
    await User.findByIdAndDelete(userID);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// UPDATE USER (Only allowed fields)
App.patch("/user/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const data = req.body;

    const ALLOWED = ["firstName", "gender", "emailId", "password"];
    const isValid = Object.keys(data).every((key) => ALLOWED.includes(key));

    if (!isValid) {
      throw new Error("User cannot be updated with invalid fields");
    }

    await User.findByIdAndUpdate(userID, data, { runValidators: true });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Update Failed: " + err.message);
  }
});

// senduserrequest API
App.post("/senduserrequest",userAuth, async (req,res)=>{
   try {
     const users = req.user;
     res.send(users.firstName + " is send requset succesfully");
   } catch (err) {
      res.status(400).send("somethingwentwrong");
   }

})

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

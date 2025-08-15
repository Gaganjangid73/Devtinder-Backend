const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const JWT = require("jsonwebtoken");
const { Signupvalidation } = require("../Utiles/Signupvalidation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");


authRouter.use(express.json());
authRouter.use(cookieParser());

// SIGNUP API
authRouter.post("/signup", async (req, res) => {
  try {
    Signupvalidation(req);
    const { firstName, lastName, emailId, password ,gender} = req.body;

    const passwordhash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordhash,
      gender,
    });

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});


//LOGIN API (JWT issued here)
authRouter.post("/login", async (req, res) => {
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

    res.cookie("token", token);

    res.send(LoginUser);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});


// Logout API 
authRouter.post("/logout", async (req, res)=>{
  res.cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true
  });
  res.send("Logout successfully");
});

module.exports = authRouter;
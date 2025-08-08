const express = require("express");
const profileRouter = express.Router();
const userAuth = require("./middleware/userauth");

//  GET PROFILE (using token from cookies)
profileRouter.get("/profile",userAuth, async (req, res) => {
  try {
    res.send(req.user); // gwt user profile of login user 
  } catch (err) {
    // console.error("Error in /profile:", err.message);
    res.status(401).send("Unauthorized: " + err.message);
  }
});

module.exports = profileRouter;
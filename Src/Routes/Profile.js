const express = require('express');
const profileRouter = express.Router();
const userAuth = require("../middleware/userauth");
const { validateEditProfileData } = require("../Utiles/validateEditProfileData");


// GET PROFILE (using token from cookies)
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized: User not found");
    }
    res.send(req.user); // get user profile of logged-in user
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

// PATCH Profile Update API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditProfileData(req);
    
    const allowedUpdates = ["firstName", "lastName", "emailId", "age", "gender"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).send("Invalid updates!");
    }
    
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

module.exports = profileRouter;
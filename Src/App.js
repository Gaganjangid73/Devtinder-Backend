const express = require("express");
const ConnectDB = require("./Config/database");
const User = require("./models/user");
const App = express();
const {Signupvalidation} = require("./Utiles/Signupvalidation");
const bcrypt = require("bcrypt");

App.use(express.json());

//Signup API
App.post("/signup", async (req, res) => {
   try {
    // step 1 = check validation 
     Signupvalidation(req);
    // step 2 = Encrypt the password and then store it into the database 
    const {firstName,lastName,emailId,password} = req.body;

    const passwordhash = await bcrypt.hash(password, 10);
    // here we are creating the instance of the user model
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordhash,
  });

    await user.save();
    res.send("user created succesfully");
  } catch (err) {
    res.status(400).send("Error saving the user :" + err.message);
  }
});

// User Found API
App.get("/user", async (req, res) => {
  const useremail = req.body.emailId;

  try {
    const Users = await User.find({ emailId: useremail });
    if (Users.length === 0) {
      res.status(404).send("User  Not Found");
    } else {
      res.send(Users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//Feed API
App.get("/feed", async (req, res) => {
  try {
    const FeedUser = await User.find({});
    res.send(FeedUser);
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

//Delete User
App.delete("/user", async (req, res) => {
  const userId = req.body.userID;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user delete succesfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
// Update  the user
App.patch("/user/:userID", async (req, res) => {
  const userID = req.params?.userID;
  const data = req.body;

  try {
    const ALLOWED = ["firstName", "gender", "emailId" , "password"];
    const isupdated = Object.keys(data).every((k) => { // run loop for every object in allowed variable.
      ALLOWED.includes(k)
    })
    if(!isupdated){
      throw new Error("user canot be updated");
    }
    await User.findByIdAndUpdate(userID, data,{runValidators :true});
    res.send("user updated succesfully");
  } catch (err) {
    res.status(400).send("Updated Failed" + err.message);
  }
});

ConnectDB()
  .then(() => {
    console.log("Coonected to the database");
    // Start server that listen the request
    App.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("connection could not be established");
  });

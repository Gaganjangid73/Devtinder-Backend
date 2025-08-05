const express = require("express");
const ConnectDB = require("./Config/database");
const User = require("./models/user");
const App = express();

App.use(express.json());

//Signup API
App.post("/signup", async (req, res) => {
  // here we are creating the instance of the user model
  const user = new User(req.body);
  try {
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
App.patch("/user", async (req, res) => {
  const userID = req.body.userID;
  const data = req.body;

  try {
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

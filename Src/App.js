const express = require("express");
const ConnectDB = require("./Config/database");
const User = require("./models/user");
const App = express();

App.post("/signup", async (req, res) => {
    // here we are creating the instance of the user model
  const user = new User({
    firstName : "Gagan",
    lastName : "Jangid",
    emailId : "gagan@gg.in",
    password : "gagan@122"
  }
  );
  try {
   await user.save();
    res.send("user created succesfully");
  } catch (err) {
    res.status(400).send("Error saving the user :" + err.message);
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

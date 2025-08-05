const express = require("express");
const App = express();
const {userAuth} = require("../middleware/userauth")



App.get("/user",userAuth,(req,res)=>{
  res.send("Sent all the data");
});

App.post("/user", (req,res)=>{
   res.send("Database successfully Connected");
});

App.delete("/user",(req,res)=>{
    res.send("user was deleted succesfully.!!❤️");
});
// Start server that listen the request 
App.listen(3000, () => {
    console.log("Server is running on port 3000");
});

const express = require("express");
const requestrouter = express.Router();
const userAuth = require("../middleware/userauth");


// senduserrequest API
requestrouter.post("/senduserrequest",userAuth, async (req,res)=>{
   try {
     const users = req.user;
     res.send(users.firstName + " is send request successfully");
   } catch (err) {
      res.status(400).send("Something went wrong");
   }

});


module.exports = requestrouter;
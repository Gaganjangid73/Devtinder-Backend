const express = require("express");
const requestrouter = express.Router();


// senduserrequest API
App.post("/senduserrequest",userAuth, async (req,res)=>{
   try {
     const users = req.user;
     res.send(users.firstName + " is send requset succesfully");
   } catch (err) {
      res.status(400).send("somethingwentwrong");
   }

});


module.exports = requestrouter;
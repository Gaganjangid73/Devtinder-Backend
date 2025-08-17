const express = require("express");
const userrouter = express.Router();
const userAuth = require("../middleware/userauth")
const ConnectionRequest = require("../models/connectionrequest");
const User = require("../models/user");


// get all the pending Connection request for the Loggedin user 
userrouter.get("/user/requests/pending",userAuth, async (req,res)=>{
try {
    const LoggedinUser = req.user;
 
    const connectionRequest =  await ConnectionRequest.find({
        touserId : LoggedinUser._id,
        status: "interested"
    }).populate("fromuserId",["firstName" ,"lastName"]);

    res.json({
        message: "Data fetched successully",
        data : connectionRequest,
    })
    
} catch (err) {
    res.status(400).send("ERROR" + err.message);
}
})

// connections of the user 
userrouter.get("/user/connections" , userAuth ,async(req,res)=>{
    try {
        const loggedin = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { touserId: loggedin._id, status: "accepted"},
                  { fromuserId: loggedin._id, status: "accepted"},
            ],
        }).populate("fromuserId",["firstName" ,"lastName"]);

        const data = connectionRequest.map((row)=>{ row.fromuserId});
      
        res.json({data});

    } catch (err) {
        res.status(400).send({message: err.message})
        
    }
})

// user feed APi
userrouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
const USER_SAFE_DATA = "firstName lastName photourl age gender about skills";

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userrouter;
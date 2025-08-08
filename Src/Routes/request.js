const express = require("express");
const requestrouter = express.Router();
const userAuth = require("../middleware/userauth");
const ConnectionRequest = require("../models/connectionrequest");
const User = require("../models/user");

// senduserrequest API
requestrouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromuserId = req.user._id;
      const touserId = req.params.toUserId;
      const status = req.params.status;

      const ALLOWED = ["ignore", "interested"];
      if (!ALLOWED.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }
        
      const user = await User.findById(touserId);
      if(!user){
         return res.status(404).json({message: "User  Not Found" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromuserId,
            touserId,
          },
          {
            fromuserId: touserId,
            touserId: fromuserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists !!" });
      }
      const connectionRequest = new ConnectionRequest({
        fromuserId,
        touserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection Request sent Succesfull ",
        data,
      });
    } catch (err) {
      res.status(400).send("Something went wrong i think something is not good ");
    }
  }
);

module.exports = requestrouter;

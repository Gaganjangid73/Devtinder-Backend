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

      // Prevent users from sending requests to themselves
      if (fromuserId.toString() === touserId) {
        return res.status(400).json({ message: "Cannot send request to yourself" });
      }

      const ALLOWED = ["ignore", "interested"];
      if (!ALLOWED.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      // Check if the target user exists
      const user = await User.findById(touserId);
      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }

      // Check if a connection request already exists in either direction
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromuserId: fromuserId,
            touserId: touserId,
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
          .json({ message: "Connection Request Already Exists !!" });
      }

      // Create and save the new connection request
      const connectionRequest = new ConnectionRequest({
        fromuserId,
        touserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection Request sent Successfully",
        data,
      });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong", error: err.message });
    }
  }
);

requestrouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedinuser = req.user;
    const { status, requestId } = req.params;

    // Validate status
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status not allowed" });
    }

    // Validate requestId
    if (!requestId || !requestId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid requestId" });
    }

    // Find the connection request
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      touserId: loggedinuser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found or already reviewed" });
    }

    // Prevent duplicate review
    if (connectionRequest.status !== "interested") {
      return res.status(400).json({ message: "Connection request already reviewed" });
    }

    // Update status
    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({ message: `Connection request ${status}`, data });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

module.exports = requestrouter;
